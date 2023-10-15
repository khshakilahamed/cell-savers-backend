import { USER_ROLE } from '@prisma/client';
import prisma from '../../../shared/prisma';
import { hashPasswordHelpers } from '../../../helpers/hashPasswordHelpers';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { CreateUserType, IsUserExistType } from './user.interface';
import { userSelectOptions } from './user.constant';

const isExistUser = async (email: string): Promise<IsUserExistType | null> => {
  const user = await prisma.user.findFirst({
    where: {
      email,
    },
    include: {
      role: true,
    },
  });

  return user;
};

const userRole = async (role: USER_ROLE) => {
  const result = await prisma.role.findUnique({
    where: {
      title: role,
    },
  });

  return result;
};

const createAgent = async (payload: CreateUserType) => {
  const { password, roleId, ...othersData } = payload;

  const isExistUser = await UserUtils.isExistUser(payload.email);

  if (isExistUser) {
    throw new ApiError(httpStatus.CONFLICT, 'User already exist');
  }

  const hashedPassword = await hashPasswordHelpers.hashPassword(password);

  const userData = {
    email: payload.email,
    roleId: roleId,
    password: hashedPassword,
  };

  const result = await prisma.$transaction(async transactionClient => {
    const user = await transactionClient.user.create({
      data: userData,
      select: userSelectOptions,
    });

    const data = { ...othersData, userId: user.id };
    await transactionClient.customerAgent.create({ data });

    return {
      ...user,
    };
  });

  return result;
};

export const UserUtils = { isExistUser, createAgent, userRole };
