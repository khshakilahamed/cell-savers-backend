import { GENDER } from '@prisma/client';
import { ICustomerPayload } from '../customer/customer.interface';

export type ICustomerAgentFilterRequest = {
  searchTerm?: string | undefined;
  id?: string | undefined;
  gender?: GENDER | undefined;
};

export type ICustomerAgentPayload = {
  roleId?: string;
} & ICustomerPayload;
