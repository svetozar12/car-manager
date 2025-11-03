import express from 'express';
import { sendCode, verifyEmailCode } from './auth.controller';
import {
  sendCodeRequestSchema,
  verifyCodeResponseSchema,
  verifyCodeSchema,
} from './auth.schema';
import { messageResponse } from '../../utils/reqResponse';
import { User } from '../../db/mongo/models/User.model';
import { logger } from '../../utils/logger';
import { registry } from '../../utils/openAPI/registry';
import z from 'zod';

export const authRouter = express.Router();

const routePath = '/api/auth';

registry.registerPath({
  method: 'post',
  path: `${routePath}/sendCode`,
  tags: ['Auth'],
  summary: 'Send email code',
  request: {
    body: {
      required: true,
      content: { 'application/json': { schema: sendCodeRequestSchema } },
    },
  },
  responses: {
    201: {
      description: 'Send code',
      content: { 'application/json': { schema: z.string() } },
    },
  },
});
authRouter.post('/sendCode', async (req, res) => {
  logger.info([req.body, 'hello']);
  try {
    const { email } = sendCodeRequestSchema.parse(req.body);
    await sendCode(email);
    return res.json(messageResponse('Code was sent successfully'));
  } catch (error) {
    logger.error(error);
  }
});

registry.registerPath({
  method: 'post',
  path: `${routePath}/verify`,
  tags: ['Auth'],
  summary: 'Verify email code',
  request: {
    body: {
      required: true,
      content: { 'application/json': { schema: sendCodeRequestSchema } },
    },
  },
  responses: {
    201: {
      description: 'Verify code',
      content: { 'application/json': { schema: verifyCodeResponseSchema } },
    },
  },
});
authRouter.post('/verify', async (req, res) => {
  const { code, email } = verifyCodeSchema.parse(req.body);
  const isVerified = await verifyEmailCode({ code, email });
  if (!isVerified) return res.json(messageResponse('Invalid code')).status(401);
  // get the user
  let user = await User.findOne({ email }).lean();
  if (!user) {
    user = await User.create({ email, avatar: 'default' });
  }
  req.session.regenerate((err) => {
    if (err) return res.status(500).end();
    req.session.userId = String(user._id);
    // req.session.roles = user.roles;
    res.json({ ok: true, csrfToken: req.csrfToken?.() });
  });
});
