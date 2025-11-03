import crypto from 'crypto';
import { sendEmail } from '../../utils/auth';
import { importTemplate, templateEnum } from '../../utils/emailTemplate';
import { redis } from '../../db/redis';
import { Envs } from '../../utils/env';
import { logger } from '../../utils/logger';

export async function sendCode(to: string) {
  const code = generateCode();
  const sendCodeTemplate = await importTemplate(templateEnum.SEND_CODE, {
    code,
  });
  await redis.set(`verify:${to}:code`, hashCode(code), 'EX', 12000);
  await redis.set(`verify:${to}:attempts`, 0);

  await sendEmail(to, 'Your code for Car Manager', sendCodeTemplate);
}

const CODE_LENGTH = 6;
const MAX_ATTEMPTS = 5;

/** Generate a zero-padded numeric code, e.g. "482913" */
export function generateCode(len = CODE_LENGTH): string {
  // 10^len - 1 inclusive range
  const max = 10 ** len - 1;
  const min = 10 ** (len - 1);
  const n = crypto.randomInt(min, max + 1);
  return String(n).padStart(len, '0');
}

/** Hash a code using HMAC-SHA256 (no need to store raw code) */
export function hashCode(code: string): string {
  return crypto
    .createHmac('sha256', Envs.VERIFY_CODE_HMAC_SECRET)
    .update(code)
    .digest('hex');
}

/** Constant-time equality check for two hex strings */
function safeEqualHex(a: string, b: string): boolean {
  try {
    const ab = Buffer.from(a, 'hex');
    const bb = Buffer.from(b, 'hex');
    return ab.length === bb.length && crypto.timingSafeEqual(ab, bb);
  } catch {
    return false;
  }
}

function keys(email: string) {
  const e = email.toLowerCase().trim();
  return {
    codeKey: `verify:${e}:code`,
    attemptsKey: `verify:${e}:attempts`,
  };
}

/**
 * Verify a submitted code.
 * Returns boolean; on success optionally consumes the code (deletes keys).
 */
export async function verifyEmailCode(params: {
  email: string;
  code: string;
}): Promise<boolean> {
  const { email, code } = params;
  const { codeKey, attemptsKey } = keys(email);

  const [storedHash, codeTtl] = await Promise.all([
    redis.get(codeKey),
    redis.ttl(codeKey),
  ]);

  if (!storedHash || codeTtl <= 0) {
    logger.error(['FAILED 1', storedHash, codeTtl]);
    return false;
  }

  const attempts = await redis.incr(attemptsKey);

  if (attempts === 1 && codeTtl > 0) {
    await redis.expire(attemptsKey, codeTtl);
  }

  if (attempts > MAX_ATTEMPTS) {
    logger.error('FAILED 2');

    return false; // locked out
  }

  const matches = safeEqualHex(storedHash, hashCode(code));

  if (!matches) {
    logger.error(['FAILED 3', storedHash, code]);

    return false; // wrong code (attempt already bumped)
  }

  await redis.multi().del(codeKey).del(attemptsKey).exec();

  return true;
}
