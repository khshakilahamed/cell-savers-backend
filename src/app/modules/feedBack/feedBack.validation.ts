import { z } from 'zod';

const create = z.object({
  body: z.object({
    comment: z.string({
      required_error: 'Comment is required',
    }),
  }),
});

const update = z.object({
  body: z.object({
    comment: z.string().optional(),
  }),
});

export const FeedbackValidation = { create, update };
