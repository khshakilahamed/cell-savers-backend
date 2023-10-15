import { z } from 'zod';

const create = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required',
    }),
    price: z.number({
      required_error: 'Price is required',
    }),
    description: z.string({
      required_error: 'Description is required',
    }),
  }),
});

const update = z.object({
  body: z.object({
    title: z.string().optional(),
    price: z.number().optional(),
    description: z.string().optional(),
  }),
});

export const ServiceValidation = { create, update };
