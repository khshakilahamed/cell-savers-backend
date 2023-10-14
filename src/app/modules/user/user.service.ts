/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Admin,
  Customer,
  SuperAdmin,
  Technician,
  USER_ROLE,
  User,
} from '@prisma/client';
import prisma from '../../../shared/prisma';
import { hashPasswordHelpers } from '../../../helpers/hashPasswordHelpers';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { UserUtils } from './user.utils';

const createCustomer = async (data: Customer & User) => {
  const { email, password, ...othersData } = data;

  const isExistUser = await UserUtils.isExistUser(email);

  if (isExistUser) {
    throw new ApiError(httpStatus.CONFLICT, 'User already exist');
  }

  const hashedPassword = await hashPasswordHelpers.hashPassword(password);

  const authData = {
    email,
    role: USER_ROLE.CUSTOMER,
    password: hashedPassword,
  };

  const result = await prisma.$transaction(async transactionClient => {
    const user = await transactionClient.user.create({ data: authData });

    const data = { ...othersData, userId: user.id };
    const customer = await transactionClient.customer.create({ data });

    return {
      ...customer,
      email: user.email,
      role: user.role,
    };
  });

  return result;
};

const createAdmin = async (data: Admin & User) => {
  const { email, password, ...othersData } = data;

  const isExistUser = await UserUtils.isExistUser(email);

  if (isExistUser) {
    throw new ApiError(httpStatus.CONFLICT, 'User already exist');
  }

  const hashedPassword = await hashPasswordHelpers.hashPassword(password);

  const authData = { email, role: USER_ROLE.ADMIN, password: hashedPassword };

  const result = await prisma.$transaction(async transactionClient => {
    const user = await transactionClient.user.create({ data: authData });

    const data = { ...othersData, userId: user.id };
    const admin = await transactionClient.admin.create({ data });

    return {
      ...admin,
      email: user.email,
      role: user.role,
    };
  });

  return result;
};

const createSuperAdmin = async (data: SuperAdmin & User) => {
  const { email, password, ...othersData } = data;

  const isExistUser = await UserUtils.isExistUser(email);

  if (isExistUser) {
    throw new ApiError(httpStatus.CONFLICT, 'User already exist');
  }

  const hashedPassword = await hashPasswordHelpers.hashPassword(password);

  const authData = {
    email,
    role: USER_ROLE.SUPER_ADMIN,
    password: hashedPassword,
  };

  const result = await prisma.$transaction(async transactionClient => {
    const user = await transactionClient.user.create({ data: authData });

    const data = { ...othersData, userId: user.id };
    const admin = await transactionClient.superAdmin.create({ data });

    return {
      ...admin,
      email: user.email,
      role: user.role,
    };
  });

  return result;
};

const createTechnician = async (data: Technician & User) => {
  const { email, password, ...othersData } = data;

  const isExistUser = await UserUtils.isExistUser(email);

  if (isExistUser) {
    throw new ApiError(httpStatus.CONFLICT, 'User already exist');
  }

  const hashedPassword = await hashPasswordHelpers.hashPassword(password);

  const authData = {
    email,
    role: USER_ROLE.TECHNICIAN,
    password: hashedPassword,
  };

  const result = await prisma.$transaction(async transactionClient => {
    const user = await transactionClient.user.create({ data: authData });

    const data = { ...othersData, userId: user.id };
    const admin = await transactionClient.technician.create({ data });

    return {
      ...admin,
      email: user.email,
      role: user.role,
    };
  });

  return result;
};

const getAllUsers = async (): Promise<any> => {
  const result = await prisma.user.findMany({
    include: {
      admins: true,
      customers: true,
      superAdmins: true,
      technicians: true,
    },
  });

  return result;
};

export const UserService = {
  createCustomer,
  createAdmin,
  createSuperAdmin,
  createTechnician,
  getAllUsers,
};
