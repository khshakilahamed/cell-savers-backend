/* eslint-disable @typescript-eslint/no-explicit-any */
import { paginationHelpers } from '../../../helpers/paginationHelpers';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { CustomerAgent, Prisma, USER_ROLE } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import {
  ICustomerAgentFilterRequest,
  ICustomerAgentPayload,
} from './customerAgent.interface';
import {
  customerAgentRelationalFields,
  customerAgentRelationalFieldsMapper,
  customerAgentSearchableFields,
  customerAgentSelectedItems,
} from './customerAgent.constant';

const getFromDB = async (
  filters: ICustomerAgentFilterRequest,
  options: IPaginationOptions,
): Promise<IGenericResponse<CustomerAgent[]>> => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: customerAgentSearchableFields.map(field => ({
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

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => {
        if (customerAgentRelationalFields.includes(key)) {
          return {
            [customerAgentRelationalFieldsMapper[key]]: {
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

  const whereConditions: Prisma.CustomerAgentWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.customerAgent.findMany({
    include: customerAgentSelectedItems,
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.customerAgent.count({ where: whereConditions });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getSingleFromDB = async (id: string): Promise<CustomerAgent | null> => {
  const result = await prisma.customerAgent.findFirst({
    where: {
      id,
    },
    include: customerAgentSelectedItems,
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Customer agent does not exist');
  }

  return result;
};

const updateIntoDB = async (
  id: string,
  payload: ICustomerAgentPayload,
): Promise<CustomerAgent | null> => {
  const isCustomerAgentExist = await prisma.customerAgent.findFirst({
    where: {
      id,
    },
  });

  if (!isCustomerAgentExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Customer agent does not exist');
  }

  const result = await prisma.$transaction(async transactionClient => {
    const { roleId, ...customerAgentData } = payload;
    const updateCustomerAgent = await transactionClient.customerAgent.update({
      where: {
        id,
      },
      data: customerAgentData,
      include: customerAgentSelectedItems,
    });

    const userPayloadData: any = {};

    if (payload?.email) {
      userPayloadData['email'] = payload?.email;
    }
    if (roleId) {
      userPayloadData['roleId'] = roleId;
    }

    if (payload.email || payload.roleId) {
      await transactionClient.user.update({
        where: {
          id: updateCustomerAgent.userId,
        },
        data: userPayloadData,
      });
    }

    return updateCustomerAgent;
  });

  return result;
};

const deleteFromDB = async (id: string): Promise<CustomerAgent | null> => {
  const isCustomerAgentExist = await prisma.customerAgent.findFirst({
    where: {
      id,
    },
  });

  if (!isCustomerAgentExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Customer agent does not exist');
  }

  const result = await prisma.$transaction(async transactionClient => {
    const deletedCustomerAgent = await transactionClient.customerAgent.delete({
      where: {
        id,
      },
      include: customerAgentSelectedItems,
    });

    await transactionClient.user.delete({
      where: {
        id: deletedCustomerAgent?.userId,
      },
    });

    return deletedCustomerAgent;
  });

  return result;
};

const getAvailableTechnician = async (payload: {
  bookingDate?: string;
  timeSlot?: string;
}) => {
  const alreadyBookedOnGivenDate = await prisma.booking.findMany({
    where: {
      bookingDate: payload?.bookingDate ? payload?.bookingDate : '',
    },
  });

  const technician = await prisma.role.findFirst({
    where: {
      title: USER_ROLE.technician,
    },
  });

  const technicians = await prisma.customerAgent.findMany({
    where: {
      user: {
        roleId: technician?.id,
      },
    },
  });

  const availableTechnicianOnGivenDate = technicians.filter(
    (technician: CustomerAgent) => {
      let exist = 0;
      for (const booking of alreadyBookedOnGivenDate) {
        if (
          booking.customerAgentId === technician.id &&
          payload?.timeSlot === booking.slotId
        ) {
          exist += 1;
        }
      }

      if (exist === 0) {
        return technician;
      }
    },
  );

  return availableTechnicianOnGivenDate;
};

export const CustomerAgentService = {
  getFromDB,
  getSingleFromDB,
  updateIntoDB,
  deleteFromDB,
  getAvailableTechnician,
};
