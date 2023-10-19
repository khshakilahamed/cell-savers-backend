/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from '../../../shared/prisma';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { IBlogFilterRequest, IBlogPayload } from './blog.interface';
import { Blog, Prisma } from '@prisma/client';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelpers';
import { blogSearchableFields } from './blog.constant';

const insertIntoDB = async (
  userId: string,
  payload: IBlogPayload,
): Promise<Blog> => {
  const customerAgent = await prisma.customerAgent.findFirst({
    where: {
      userId,
    },
  });

  if (!customerAgent) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Customer Agent not found');
  }

  const blogData = {
    ...payload,
    customerAgentId: customerAgent?.id,
  };

  const result = await prisma.blog.create({
    data: blogData,
    include: {
      customerAgent: true,
    },
  });

  return result;
};

const getFromDB = async (
  filters: IBlogFilterRequest,
  options: IPaginationOptions,
): Promise<IGenericResponse<Blog[]>> => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: blogSearchableFields.map(field => ({
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

  const whereConditions: Prisma.BlogWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.blog.findMany({
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

  const total = await prisma.blog.count({ where: whereConditions });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getSingleFromDB = async (id: string): Promise<Blog | null> => {
  const result = await prisma.blog.findFirst({
    where: {
      id,
    },
  });

  return result;
};

const updateIntoDB = async (
  id: string,
  payload: Partial<IBlogPayload>,
): Promise<Blog | null> => {
  const result = await prisma.blog.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};

const deleteFromDB = async (id: string): Promise<Blog | null> => {
  const result = await prisma.blog.delete({
    where: {
      id,
    },
  });

  return result;
};

export const BlogService = {
  insertIntoDB,
  getFromDB,
  getSingleFromDB,
  updateIntoDB,
  deleteFromDB,
};
