import { z } from 'zod';

const create = z.object({
  body: z.object({
    startTime: z.string({
      required_error: 'Start time is required',
    }),
    endTime: z.string({
      required_error: 'End time is required',
    }),
  }),
});

const update = z.object({
  body: z.object({
    startTime: z.string().optional(),
    endTime: z.string().optional(),
  }),
});

export const TimeSlotValidation = { create, update };
