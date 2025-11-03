import { z } from './utils/openAPI/zod-extended';

export const HealthResponse = z.object({ ok: z.boolean() });

export const CreateUserBody = z.object({
  email: z.email(),
  name: z.string().min(1),
});

export const User = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
});
