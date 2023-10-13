import { Customer, User } from '@prisma/client';
import prisma from '../../../shared/prisma';

const createCustomer = async (data: Customer & User) => {
  const { email, password, ...othersData } = data;

  const authData = { email, password };

  const result = await prisma.$transaction(async transactionClient => {
    const user = await transactionClient.user.create({ data: authData });

    const data = { ...othersData, userId: user.id };
    const customer = await transactionClient.customer.create({ data });

    return {
      ...customer,
      email: user.email,
    };
  });

  return result;
};

export const UserService = {
  createCustomer,
};
