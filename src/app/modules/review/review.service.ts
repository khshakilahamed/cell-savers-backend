import prisma from '../../../shared/prisma';
import { IReviewPayload } from './review.interface';
import { IUserAuthPayload } from '../user/user.interface';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';

const insertIntoDB = async (
  auth: IUserAuthPayload,
  payload: IReviewPayload,
) => {
  const customer = await prisma.customer.findFirst({
    where: {
      userId: auth.userId,
      email: auth.email,
    },
  });

  if (!customer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Customer does not found');
  }

  const booking = await prisma.booking.findFirst({
    where: {
      id: payload.bookingId,
      customerId: customer?.id,
    },
  });

  if (!booking) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Booking does not found');
  }

  if (!booking.readyToReview) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'You can not make review now');
  }

  const reviewPayload = {
    ...payload,
    customerId: customer?.id,
    serviceId: booking?.serviceId,
    customerAgentId: booking?.customerAgentId,
  };

  const result = await prisma.$transaction(async transactionClient => {
    await prisma.booking.update({
      where: {
        id: payload.bookingId,
        customerId: customer?.id,
      },
      data: {
        isReviewDone: true,
      },
    });

    const review = await transactionClient.review.create({
      data: reviewPayload,
    });

    return review;
  });

  return result;
};

const getFromDB = async () => {
  const result = await prisma.review.findMany({});

  return result;
};

const getSingleFromDB = async (id: string) => {
  const result = await prisma.review.findFirst({
    where: {
      id,
    },
  });

  return result;
};

const updateIntoDB = async (id: string, payload: Partial<IReviewPayload>) => {
  const result = await prisma.review.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};

const deleteFromDB = async (id: string) => {
  const isReviewExist = await prisma.review.findFirst({
    where: {
      id,
    },
  });

  if (!isReviewExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Review does not found');
  }

  const result = await prisma.review.delete({
    where: {
      id,
    },
  });

  return result;
};

export const ReviewService = {
  insertIntoDB,
  getFromDB,
  getSingleFromDB,
  updateIntoDB,
  deleteFromDB,
};
