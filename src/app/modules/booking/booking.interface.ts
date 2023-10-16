import { BOOKING_STATUS, ISSUE_STATUS } from '@prisma/client';

export type IBookingFilterRequest = {
  searchTerm?: string | null;
  customerId?: string | null;
  customerAgentId?: string | null;
  serviceId?: string | null;
  slotId?: string | null;
};

export type IBookingPayload = {
  bookingDate?: string;
  issueDescription?: string;
  bookingStatus?: BOOKING_STATUS;
  issueStatus?: ISSUE_STATUS;
  slotId?: string;
  serviceId?: string;
  customerId?: string;
  customerAgentId?: string;
  readyToReview?: boolean;
};
