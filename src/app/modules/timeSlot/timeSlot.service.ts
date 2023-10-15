import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { ITimeSlotPayload } from './timeSlot.interface';
import { timeSlotConflict } from './timeSlot.utils';
import prisma from '../../../shared/prisma';
import { TimeSlot } from '@prisma/client';

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

const getFromDB = async (): Promise<TimeSlot[]> => {
  const result = await prisma.timeSlot.findMany();

  return result;
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

export const TimeSlotService = {
  insertIntoDB,
  getFromDB,
  getSingleFromDB,
  updateIntoDB,
  deleteFromDB,
};
