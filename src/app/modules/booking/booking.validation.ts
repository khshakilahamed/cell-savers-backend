import { z } from 'zod';
import { bookingStatus, issueStatus } from './booking.constant';

const create = z.object({
  body: z.object({
    bookingDate: z.string({
      required_error: 'Booking Date is required',
    }),
    issueDescription: z.string().optional(),
    slotId: z.string({
      required_error: 'Slot is required',
    }),
    serviceId: z.string({
      required_error: 'Service is required',
    }),
    customerAgentId: z.string({
      required_error: 'Customer agent is required',
    }),
  }),
});

const update = z.object({
  body: z.object({
    bookingDate: z.string().optional(),
    issueDescription: z.string().optional(),
    customerId: z.string().optional(),
    slotId: z.string().optional(),
    serviceId: z.string().optional(),
    customerAgentId: z.string().optional(),
    bookingStatus: z.enum(bookingStatus as [string, ...string[]]).optional(),
    issueStatus: z.enum(issueStatus as [string, ...string[]]).optional(),
  }),
});

export const BookingValidations = {
  create,
  update,
};
