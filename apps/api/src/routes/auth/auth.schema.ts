import z from 'zod';

export const sendCodeSchema = z.object({
  email: z.email(),
});

export const verifyCodeSchema = sendCodeSchema.extend({ code: z.string() });
