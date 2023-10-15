import prisma from '../../../shared/prisma';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { FeedBack } from '@prisma/client';
import { IFeedBackPayload } from './feedBack.interface';

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

const getFromDB = async (): Promise<FeedBack[]> => {
  const result = await prisma.feedBack.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return result;
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

export const FeedbackService = {
  insertIntoDB,
  getFromDB,
  getSingleFromDB,
  updateIntoDB,
  deleteFromDB,
};
