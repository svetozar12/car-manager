import { z } from '../../utils/openAPI/zod-extended';

export const sendCodeRequestSchema = z
  .object({
    email: z.email(),
  })
  .openapi('SendAuthCodeRequest');

export const verifyCodeSchema = sendCodeRequestSchema
  .extend({
    code: z.string(),
  })
  .openapi('VerifyAuthCodeRequest');

export const verifyCodeResponseSchema = sendCodeRequestSchema
  .extend({
    ok: z.boolean(),
    csrfToken: z.string().optional(),
  })
  .openapi('VerifyAuthCodeResponse');
