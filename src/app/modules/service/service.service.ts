import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';
import { Service } from '@prisma/client';
import { IServicePayload } from './service.interface';

const insertIntoDB = async (payload: IServicePayload): Promise<Service> => {
  const { title } = payload;

  const isServiceExist = await prisma.service.findFirst({
    where: {
      title,
    },
  });

  if (isServiceExist) {
    throw new ApiError(httpStatus.CONFLICT, 'This Service already exist');
  }

  const result = await prisma.service.create({
    data: payload,
  });

  return result;
};

const getAllFromDB = async (): Promise<Service[]> => {
  const result = await prisma.service.findMany();

  return result;
};

const getSingleFromDB = async (id: string): Promise<Service | null> => {
  const result = await prisma.service.findUnique({
    where: {
      id,
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Service does not exist');
  }

  return result;
};

const updateIntoDB = async (
  id: string,
  payload: Partial<IServicePayload>,
): Promise<Service | null> => {
  const isServiceExist = await prisma.service.findUnique({
    where: {
      id,
    },
  });

  if (!isServiceExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Service does not exist');
  }

  const result = await prisma.service.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};

const deleteFromDB = async (id: string): Promise<Service | null> => {
  const isServiceExist = await prisma.service.findUnique({
    where: {
      id,
    },
  });

  if (!isServiceExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Service does not exist');
  }

  const result = await prisma.service.delete({
    where: {
      id,
    },
  });

  return result;
};

export const ServiceOfService = {
  insertIntoDB,
  getAllFromDB,
  getSingleFromDB,
  updateIntoDB,
  deleteFromDB,
};
