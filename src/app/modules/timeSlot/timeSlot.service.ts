/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { ITimeSlotFilterRequest, ITimeSlotPayload } from './timeSlot.interface';
import { timeSlotConflict } from './timeSlot.utils';
import prisma from '../../../shared/prisma';
import { Booking, Prisma, TimeSlot } from '@prisma/client';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { paginationHelpers } from '../../../helpers/paginationHelpers';
import { timeSlotSearchableFields } from './timeSlot.constant';
import { IGenericResponse } from '../../../interfaces/common';

const insertIntoDB = async (payload: ITimeSlotPayload): Promise<TimeSlot> => {
  const isTimeSlotConflict = await timeSlotConflict(payload);

  if (isTimeSlotConflict) {
    throw new ApiError(httpStatus.CONFLICT, 'This time slot already exist');
  }

  const result = await prisma.timeSlot.create({
    data: payload,
  });

  return result;
};

const getFromDB = async (
  filters: ITimeSlotFilterRequest,
  options: IPaginationOptions,
): Promise<IGenericResponse<TimeSlot[]>> => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: timeSlotSearchableFields.map(field => ({
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

  const whereConditions: Prisma.TimeSlotWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.timeSlot.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.timeSlot.count({ where: whereConditions });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getSingleFromDB = async (id: string): Promise<TimeSlot | null> => {
  const result = await prisma.timeSlot.findFirst({
    where: {
      id,
    },
  });

  return result;
};

const updateIntoDB = async (
  id: string,
  payload: Partial<ITimeSlotPayload>,
): Promise<TimeSlot | null> => {
  const timeSlot = await prisma.timeSlot.findFirst({
    where: {
      id,
    },
  });

  if (!timeSlot) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Time slot not found');
  }

  const result = await prisma.timeSlot.update({
    where: { id },
    data: payload,
  });

  return result;
};

const deleteFromDB = async (id: string): Promise<TimeSlot | null> => {
  const timeSlot = await prisma.timeSlot.findFirst({
    where: {
      id,
    },
  });

  if (!timeSlot) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Time slot not found');
  }

  const result = await prisma.timeSlot.delete({
    where: { id },
  });

  return result;
};

const availableTimeSlot = async (payload: { bookingDate: string }) => {
  const bookingsOnGivenDate = await prisma.booking.findMany({
    where: {
      bookingDate: payload?.bookingDate ? payload?.bookingDate : '',
    },
  });

  const timeSlots = await prisma.timeSlot.findMany({});

  const availableTimeSlotsOnGivenDate =
    bookingsOnGivenDate.length > 0
      ? bookingsOnGivenDate.map((booking: Booking) => {
          return timeSlots.filter(
            (slot: TimeSlot) => slot.id !== booking.slotId,
          );
        })
      : timeSlots;

  return availableTimeSlotsOnGivenDate;
};

export const TimeSlotService = {
  insertIntoDB,
  getFromDB,
  getSingleFromDB,
  updateIntoDB,
  deleteFromDB,
  availableTimeSlot,
};
