import z from 'zod';

export const createRequestSchema = z.object({
  params: z.object({
    organizationId: z.cuid()
  }),
  body: z.object({
    name: z.string().min(1)
  }),
});

export const getByOrganizationRequestSchema = z.object({
  params: z.object({
    organizationId: z.cuid()
  }),
});

export const getOneRequestSchema = z.object({
  params: z.object({
    projectId: z.cuid()
  }),
});

export const removeRequestSchema = z.object({
  params: z.object({
    projectId: z.cuid()
  }),
});