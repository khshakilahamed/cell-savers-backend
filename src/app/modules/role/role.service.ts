import { Role } from '@prisma/client';
import prisma from '../../../shared/prisma';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';

const insertIntoDB = async (payload: Role) => {
  const isRoleExist = await prisma.role.findFirst({
    where: {
      title: payload.title,
    },
  });

  if (isRoleExist) {
    throw new ApiError(httpStatus.CONFLICT, 'Role Already Exist');
  }

  const result = await prisma.role.create({ data: { ...payload } });

  return result;
};

const getAllFromDB = async () => {
  const result = await prisma.role.findMany();

  return result;
};

export const RoleService = { insertIntoDB, getAllFromDB };
