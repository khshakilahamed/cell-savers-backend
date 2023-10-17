import { GENDER } from '@prisma/client';

export type ICustomerFilterRequest = {
  searchTerm?: string | undefined;
  id?: string | undefined;
  gender?: GENDER | undefined;
};

export type ICustomerPayload = {
  firstName?: string;
  lastName: string;
  email?: string;
  profilePicture?: string;
  gender?: GENDER;
  contactNumber?: string;
  emergencyContactNo?: string;
  presentAddress?: string;
  permanentAddress?: string;
};
