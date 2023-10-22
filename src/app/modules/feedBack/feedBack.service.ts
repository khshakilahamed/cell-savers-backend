/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from '../../../shared/prisma';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { FeedBack, Prisma } from '@prisma/client';
import { IFeedBackPayload, IFeedbackFilterRequest } from './feedBack.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { paginationHelpers } from '../../../helpers/paginationHelpers';
import { feedbackSearchableFields } from './feedBack.constant';
import { IGenericResponse } from '../../../interfaces/common';

const insertIntoDB = async (
  userId: string,
  payload: IFeedBackPayload,
): Promise<FeedBack> => {
  const customer = await prisma.customer.findFirst({
    where: {
      userId,
    },
  });

  if (!customer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Customer not found');
  }

  const faqData = {
    ...payload,
    customerId: customer?.id,
  };

  const result = await prisma.feedBack.create({
    data: faqData,
    include: {
      customer: true,
    },
  });

  return result;
};

const getFromDB = async (
  filters: IFeedbackFilterRequest,
  options: IPaginationOptions,
): Promise<IGenericResponse<FeedBack[]>> => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  if (filterData.isSelected === 'true') {
    filterData.isSelected = true;
  }

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: feedbackSearchableFields.map(field => ({
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

  const whereConditions: Prisma.FeedBackWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.feedBack.findMany({
    include: {
      customer: true,
    },
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  // console.log(result);

  const total = await prisma.feedBack.count({ where: whereConditions });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getSingleFromDB = async (id: string): Promise<FeedBack | null> => {
  const result = await prisma.feedBack.findFirst({
    where: {
      id,
    },
  });

  return result;
};

const updateIntoDB = async (
  id: string,
  payload: Partial<IFeedBackPayload>,
): Promise<FeedBack | null> => {
  const result = await prisma.feedBack.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};

const deleteFromDB = async (id: string): Promise<FeedBack | null> => {
  const result = await prisma.feedBack.delete({
    where: {
      id,
    },
  });

  return result;
};

const selectFromDB = async (id: string) => {
  const isFeedbackExist = await prisma.feedBack.findFirst({
    where: {
      id,
    },
  });

  if (!isFeedbackExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Feedback does not exist');
  }

  const result = await prisma.feedBack.update({
    where: {
      id,
    },
    data: {
      isSelected: !isFeedbackExist.isSelected,
    },
  });

  return result;
};

export const FeedbackService = {
  insertIntoDB,
  getFromDB,
  getSingleFromDB,
  updateIntoDB,
  deleteFromDB,
  selectFromDB,
};
