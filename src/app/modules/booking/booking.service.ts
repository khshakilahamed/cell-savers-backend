/* eslint-disable @typescript-eslint/no-explicit-any */
import { BOOKING_STATUS, Booking, ISSUE_STATUS, Prisma } from '@prisma/client';
import { IUserAuthPayload } from '../user/user.interface';
import prisma from '../../../shared/prisma';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { paginationHelpers } from '../../../helpers/paginationHelpers';
import { IBookingFilterRequest, IBookingPayload } from './booking.interface';
import { IGenericResponse } from '../../../interfaces/common';
import {
  bookingRelationalFields,
  bookingRelationalFieldsMapper,
  bookingSearchableFields,
} from './booking.constant';

const insertIntoDB = async (auth: IUserAuthPayload, payload: Booking) => {
  const isCustomerExist = await prisma.customer.findFirst({
    where: {
      userId: auth.userId,
      email: auth.email,
    },
  });

  console.log(isCustomerExist);

  if (!isCustomerExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Customer does not exist');
  }

  payload['customerId'] = isCustomerExist.id;

  const alreadyHaveBookingToday = await prisma.booking.findFirst({
    where: {
      customerId: payload.customerId,
      bookingDate: payload.bookingDate,
    },
  });

  if (alreadyHaveBookingToday) {
    throw new ApiError(httpStatus.CONFLICT, 'You have already a booking today');
  }

  const isAvailable = await prisma.booking.findFirst({
    where: {
      bookingDate: payload.bookingDate,
      slotId: payload.slotId,
      customerAgentId: payload.customerAgentId,
    },
  });

  if (isAvailable) {
    throw new ApiError(httpStatus.CONFLICT, 'Already booked this slot');
  }

  const result = await prisma.booking.create({
    data: payload,
    include: {
      customer: true,
      slot: true,
      customerAgent: true,
      service: true,
    },
  });

  return result;
};

const getAllFromDB = async (
  filters: IBookingFilterRequest,
  options: IPaginationOptions,
): Promise<IGenericResponse<Booking[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: bookingSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => {
        if (bookingRelationalFields.includes(key)) {
          return {
            [bookingRelationalFieldsMapper[key]]: {
              id: (filterData as any)[key],
            },
          };
        } else {
          return {
            [key]: {
              equals: (filterData as any)[key],
            },
          };
        }
      }),
    });
  }

  const whereConditions: Prisma.BookingWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.booking.findMany({
    include: {
      customer: true,
      customerAgent: true,
      service: true,
      slot: true,
      reviews: true,
    },
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            createdAt: 'desc',
          },
  });

  const total = await prisma.booking.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getSingleFromDB = async (id: string): Promise<Booking | null> => {
  const isBookingExist = await prisma.booking.findFirst({
    where: {
      id,
    },
    include: {
      customer: true,
      customerAgent: true,
      service: true,
      slot: true,
      reviews: true,
    },
  });

  if (!isBookingExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Booking does not exist');
  }

  return isBookingExist;
};

const updateIntoDB = async (
  id: string,
  payload: IBookingPayload,
): Promise<Booking | null> => {
  const isBookingExist = await prisma.booking.findFirst({
    where: {
      id,
    },
    include: {
      customer: true,
      customerAgent: true,
      service: true,
      slot: true,
      reviews: true,
    },
  });

  if (!isBookingExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Booking does not exist');
  }

  if (payload.customerId) {
    delete payload['customerId'];
  }

  if (
    payload.bookingStatus === BOOKING_STATUS.CONFIRM &&
    (payload.issueStatus === ISSUE_STATUS.FIXED ||
      payload.issueStatus === ISSUE_STATUS.NOT_FIXED)
  ) {
    payload.readyToReview = true;
  } else {
    payload.readyToReview = false;
  }

  const result = await prisma.booking.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};

const deleteFromDB = async (id: string) => {
  const result = await prisma.booking.delete({
    where: {
      id,
    },
  });

  return result;
};

export const BookingService = {
  insertIntoDB,
  getAllFromDB,
  getSingleFromDB,
  updateIntoDB,
  deleteFromDB,
};
