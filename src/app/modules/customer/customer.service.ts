/* eslint-disable @typescript-eslint/no-explicit-any */
import { paginationHelpers } from '../../../helpers/paginationHelpers';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { Customer, Prisma } from '@prisma/client';
import { ICustomerFilterRequest, ICustomerPayload } from './customer.interface';
import {
  customerSearchableFields,
  customerSelectedItems,
} from './customer.constant';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';

const getFromDB = async (
  filters: ICustomerFilterRequest,
  options: IPaginationOptions,
): Promise<IGenericResponse<Customer[]>> => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: customerSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.CustomerWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.customer.findMany({
    include: customerSelectedItems,
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.customer.count({ where: whereConditions });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getSingleFromDB = async (id: string) => {
  const result = await prisma.customer.findFirst({
    where: {
      id,
    },
    include: customerSelectedItems,
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Customer does not exist');
  }

  return result;
};

const updateIntoDB = async (
  id: string,
  payload: ICustomerPayload,
): Promise<Customer | null> => {
  const isCustomerExist = await prisma.customer.findFirst({
    where: {
      id,
    },
  });

  if (!isCustomerExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Customer does not exist');
  }

  const result = await prisma.$transaction(async transactionClient => {
    const updateCustomer = await transactionClient.customer.update({
      where: {
        id,
      },
      data: payload,
      include: customerSelectedItems,
    });

    if (payload.email) {
      await transactionClient.user.update({
        where: {
          id: updateCustomer.userId,
        },
        data: {
          email: payload?.email,
        },
      });
    }

    return updateCustomer;
  });

  return result;
};

const deleteFromDB = async (id: string): Promise<Customer | null> => {
  const isCustomerExist = await prisma.customer.findFirst({
    where: {
      id,
    },
  });

  if (!isCustomerExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Customer does not exist');
  }

  const result = await prisma.$transaction(async transactionClient => {
    const deletedCustomer = await transactionClient.customer.delete({
      where: {
        id,
      },
      include: customerSelectedItems,
    });

    await transactionClient.user.delete({
      where: {
        id: deletedCustomer.userId,
      },
    });

    return deletedCustomer;
  });

  return result;
};

export const CustomerService = {
  getFromDB,
  getSingleFromDB,
  updateIntoDB,
  deleteFromDB,
};
