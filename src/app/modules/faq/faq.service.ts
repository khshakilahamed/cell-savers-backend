/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from '../../../shared/prisma';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { FAQ, Prisma } from '@prisma/client';
import { IFAQPayload, IFaqFilterRequest } from './faq.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelpers';
import { faqFilterableFields } from './faq.constant';

const insertIntoDB = async (
  userId: string,
  payload: IFAQPayload,
): Promise<FAQ> => {
  const customerAgent = await prisma.customerAgent.findFirst({
    where: {
      userId,
    },
  });

  if (!customerAgent) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Customer Agent not found');
  }

  const faqData = {
    ...payload,
    customerAgentId: customerAgent?.id,
  };

  const result = await prisma.fAQ.create({
    data: faqData,
    include: {
      customerAgent: true,
    },
  });

  return result;
};

const getFromDB = async (
  filters: IFaqFilterRequest,
  options: IPaginationOptions,
): Promise<IGenericResponse<FAQ[]>> => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: faqFilterableFields.map(field => ({
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

  const whereConditions: Prisma.FAQWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.fAQ.findMany({
    include: {
      customerAgent: true,
    },
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.fAQ.count({ where: whereConditions });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getSingleFromDB = async (id: string): Promise<FAQ | null> => {
  const result = await prisma.fAQ.findFirst({
    where: {
      id,
    },
  });

  return result;
};

const updateIntoDB = async (
  id: string,
  payload: Partial<IFAQPayload>,
): Promise<FAQ | null> => {
  const result = await prisma.fAQ.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};

const deleteFromDB = async (id: string): Promise<FAQ | null> => {
  const result = await prisma.fAQ.delete({
    where: {
      id,
    },
  });

  return result;
};

export const FaqService = {
  insertIntoDB,
  getFromDB,
  getSingleFromDB,
  updateIntoDB,
  deleteFromDB,
};
