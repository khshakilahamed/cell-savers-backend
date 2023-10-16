import { z } from 'zod';

const create = z.object({
  body: z.object({
    bookingId: z.string({
      required_error: 'Booking id is required',
    }),
    rating: z.number().min(0).max(5).optional(),
    comment: z.string({
      required_error: 'Comment is required',
    }),
  }),
});

const update = z.object({
  body: z.object({
    rating: z.number().min(0).max(5).optional(),
    comment: z.string().optional(),
  }),
});

export const ReviewValidation = { create, update };
