import { Customer, CustomerAgent, USER_ROLE, User } from '@prisma/client';

export type IUserResponse = {
  firstName: string;
  lastName: string;
  email: string;
  contactNo: string;
  role: USER_ROLE;
};

export type CreateUserType = {
  roleId?: string;
} & User &
  (Customer | CustomerAgent);

export type IsUserExistType = User & {
  role: {
    id: string;
    title: string;
  };
};

export type IUserAuthPayload = {
  role: USER_ROLE;
  email: string;
  userId: string;
};
