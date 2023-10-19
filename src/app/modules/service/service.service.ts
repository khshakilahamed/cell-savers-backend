/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';
import { Prisma, Service } from '@prisma/client';
import { IServiceFilterRequest, IServicePayload } from './service.interface';
import { paginationHelpers } from '../../../helpers/paginationHelpers';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { serviceSearchableFields } from './service.constant';

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

const getAllFromDB = async (
  filters: IServiceFilterRequest,
  options: IPaginationOptions,
): Promise<IGenericResponse<Service[]>> => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: serviceSearchableFields.map(field => ({
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

  const whereConditions: Prisma.ServiceWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.service.findMany({
    include: {
      reviews: {
        include: {
          customer: true,
        },
      },
    },
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.service.count({ where: whereConditions });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getSingleFromDB = async (id: string): Promise<Service | null> => {
  const result = await prisma.service.findUnique({
    include: {
      reviews: {
        include: {
          customer: true,
        },
      },
    },
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

// const getAvailableService = async (payload: {
//   serviceId?: string | undefined;
//   slotId?: string | undefined;
//   customerAgentId?: string | undefined;
//   bookingDate?: string | undefined;
// }) => {
//   const serviceWhereCondition = payload?.serviceId
//     ? { id: payload.serviceId }
//     : {};

//   const services = await prisma.service.findMany({
//     include: {
//       bookings: {
//         include: {
//           customerAgent: true,
//           slot: true,
//         },
//       },
//     },
//     where: serviceWhereCondition,
//   });

//   const bookingsOnGivenDate = await prisma.booking.findMany({
//     where: payload?.bookingDate ? { bookingDate: payload.bookingDate } : {},
//   });

//   const timeSlots = await prisma.timeSlot.findMany({});

//   const availableTimeSlotsOnGivenDate = bookingsOnGivenDate.map(
//     (booking: Booking) => {
//       return timeSlots.filter((slot: TimeSlot) => slot.id !== booking.slotId);
//     },
//   );

//   console.log(availableTimeSlotsOnGivenDate);

//   // const availableService = services.filter(service => )
//   return bookingsOnGivenDate;
// };

export const ServiceOfService = {
  insertIntoDB,
  getAllFromDB,
  getSingleFromDB,
  updateIntoDB,
  deleteFromDB,
};
