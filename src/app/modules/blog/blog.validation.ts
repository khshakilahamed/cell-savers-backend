import { z } from 'zod';

const create = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required',
    }),
    image: z.string({
      required_error: 'Image is required',
    }),
    description: z.string({
      required_error: 'Description is required',
    }),
  }),
});

const update = z.object({
  body: z.object({
    title: z.string().optional(),
    image: z.string().optional(),
    description: z.string().optional(),
  }),
});

export const BlogValidation = { create, update };
