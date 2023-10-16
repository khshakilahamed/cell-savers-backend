import { BOOKING_STATUS, ISSUE_STATUS } from '@prisma/client';

export const bookingSearchableFields = [
  'bookingDate',
  //   'bookingStatus',
  //   'issueStatus',
];

export const bookingFilterableFields = [
  'searchTerm',
  'id',
  'customerId',
  'customerAgentId',
  'slotId',
  'serviceId',
];

export const bookingRelationalFields = [
  'customerId',
  'customerAgentId',
  'slotId',
  'serviceId',
];

export const bookingRelationalFieldsMapper: {
  [key: string]: string;
} = {
  customerId: 'customer',
  customerAgentId: 'customerAgent',
  slotId: 'slot',
  serviceId: 'service',
};

// BOOKING_STATUS---
//   PENDING
//   CONFIRM
//   CANCELLED

export const bookingStatus = [...Object.keys(BOOKING_STATUS)];
export const issueStatus = [...Object.keys(ISSUE_STATUS)];

// enum ISSUE_STATUS---
//   PENDING
//   ONGOING
//   FIXED
//   NOT_FIXED
//   CANCELLED
