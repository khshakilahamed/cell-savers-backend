import prisma from '../../../shared/prisma';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { FAQ } from '@prisma/client';
import { IFAQPayload } from './faq.interface';

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

const getFromDB = async (): Promise<FAQ[]> => {
  const result = await prisma.fAQ.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return result;
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
