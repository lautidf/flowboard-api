import z from 'zod';

export const registerUserRequestSchema = z.object({
  body: z.object({
    email: z.email(),
    name: z.string().min(1),
    password: z.string().min(8)
  })
});

export const loginRequestSchema = z.object({
  body: z.object({
    email: z.email(),
    password: z.string().min(8)
  })
});