import prisma from '../../../shared/prisma';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { IBlogPayload } from './blog.interface';
import { Blog } from '@prisma/client';

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

const getFromDB = async (): Promise<Blog[]> => {
  const result = await prisma.blog.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return result;
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
