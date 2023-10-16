/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prisma, USER_ROLE, User } from '@prisma/client';
import prisma from '../../../shared/prisma';
import { hashPasswordHelpers } from '../../../helpers/hashPasswordHelpers';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { UserUtils } from './user.utils';
import { CreateUserType, IUserAuthPayload } from './user.interface';
import { selectResponseItem, userSelectOptions } from './user.constant';

const createCustomer = async (
  payload: CreateUserType,
): Promise<Partial<User>> => {
  const { password, ...othersData } = payload;

  const isExistUser = await UserUtils.isExistUser(payload.email);

  if (isExistUser) {
    throw new ApiError(httpStatus.CONFLICT, 'User already exist');
  }

  const hashedPassword = await hashPasswordHelpers.hashPassword(password);

  const userRole = await UserUtils.userRole(USER_ROLE.CUSTOMER);

  const userData = {
    email: payload.email,
    roleId: userRole?.id || 'ef2aca77-bd59-434b-ac43-bb515be8e395',
    password: hashedPassword,
  };

  const result = await prisma.$transaction(async transactionClient => {
    const user = await transactionClient.user.create({
      data: userData,
      select: { ...userSelectOptions },
    });

    const data = { ...othersData, userId: user.id };
    await transactionClient.customer.create({ data });

    return {
      ...user,
    };
  });

  return result;
};

const createAdmin = async (payload: CreateUserType): Promise<Partial<User>> => {
  const userRole = await UserUtils.userRole(USER_ROLE.ADMIN);

  payload['roleId'] = userRole
    ? userRole?.id
    : 'a0b67827-c7a3-4dfb-b39f-28fc05592f59';

  const result = await UserUtils.createAgent(payload);

  return result;
};

const createSuperAdmin = async (
  payload: CreateUserType,
): Promise<Partial<User>> => {
  const userRole = await UserUtils.userRole(USER_ROLE.SUPER_ADMIN);

  payload['roleId'] = userRole
    ? userRole?.id
    : '0df2893f-a74e-4b20-9fb6-62ec419c59b4';

  const result = await UserUtils.createAgent(payload);

  return result;
};

const createTechnician = async (
  payload: CreateUserType,
): Promise<Partial<User>> => {
  const userRole = await UserUtils.userRole(USER_ROLE.TECHNICIAN);

  payload['roleId'] = userRole
    ? userRole?.id
    : '45cc3d91-7c46-41aa-a987-beafde47bf76';

  const result = await UserUtils.createAgent(payload);

  return result;
};

const getAllUsers = async (): Promise<Partial<User>[]> => {
  const result = await prisma.user.findMany({
    select: userSelectOptions,
  });

  return result;
};

const getSingleUser = async (id: string): Promise<Partial<User> | null> => {
  const result = await prisma.user.findUnique({
    where: {
      id,
    },
    select: userSelectOptions,
  });

  return result;
};

const updateUser = async (
  id: string,
  payload: Partial<User>,
): Promise<Partial<User> | null> => {
  if (payload['email']) {
    delete payload['email'];
  }

  const isExistUser =
    id &&
    (await prisma.user.findFirst({ where: { id }, include: { role: true } }));

  if (!isExistUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User Not found');
  }

  if (isExistUser.role.title === USER_ROLE.CUSTOMER) {
    throw new ApiError(
      httpStatus.CONFLICT,
      'Customer Role could not be changeable',
    );
  }

  const result = await prisma.user.update({
    where: {
      id,
    },
    data: {
      ...payload,
    },
    select: selectResponseItem,
  });

  return result;
};

const deleteUser = async (id: string): Promise<Partial<User> | null> => {
  const isExistUser = await prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      role: true,
    },
  });

  if (!isExistUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Use does not exist');
  }

  const result = await prisma.$transaction(async transactionClient => {
    if (isExistUser.role.title === USER_ROLE.CUSTOMER) {
      await transactionClient.customer.delete({
        where: {
          email: isExistUser.email,
          userId: isExistUser.id,
        },
      });
    } else {
      await transactionClient.customerAgent.delete({
        where: {
          email: isExistUser.email,
          userId: isExistUser.id,
        },
      });
    }

    const user = await transactionClient.user.delete({
      where: {
        id,
      },
      select: userSelectOptions,
    });

    return user;
  });

  // const result = await prisma.user.delete({
  //   where: {
  //     id,
  //   },
  //   select: selectResponseItem,
  // });

  return result;
};

const getMyProfile = async (auth: IUserAuthPayload) => {
  const result = await prisma.$transaction(async transactionClient => {
    let profileData = {};
    const isUserExist = await transactionClient.user.findFirst({
      where: {
        id: auth.userId,
        email: auth.email,
        role: {
          title: auth.role,
        },
      },
      include: {
        role: true,
      },
    });

    if (isUserExist?.role.title === USER_ROLE.CUSTOMER) {
      const customer = await transactionClient.customer.findFirst({
        where: {
          userId: isUserExist?.id,
          email: isUserExist?.email,
        },
      });

      profileData = {
        ...customer,
        role: isUserExist?.role?.title,
      };
    } else {
      const customer = await transactionClient.customerAgent.findFirst({
        where: {
          userId: isUserExist?.id,
          email: isUserExist?.email,
        },
      });

      profileData = {
        ...customer,
        role: isUserExist?.role?.title,
      };
    }

    return profileData;
  });

  return result;
};

const updateMyProfile = async (
  auth: IUserAuthPayload,
  payload: Partial<CreateUserType>,
) => {
  const result = await prisma.$transaction(async transactionClient => {
    let profileData = {};
    const isUserExist = await transactionClient.user.findFirst({
      where: {
        id: auth.userId,
        email: auth.email,
        role: {
          title: auth.role,
        },
      },
      include: {
        role: true,
      },
    });

    if (isUserExist?.role.title === USER_ROLE.CUSTOMER) {
      if (payload.email) {
        delete payload['email'];
      }

      const customerWhereUniqueInput: Prisma.CustomerWhereUniqueInput = {
        userId: isUserExist.id,
        email: isUserExist.email,
      };
      const customer = await transactionClient.customer.update({
        where: customerWhereUniqueInput,
        data: payload,
      });

      profileData = {
        ...customer,
        role: isUserExist?.role?.title,
      };
    } else {
      const userUpdatedData: Partial<User> = {};

      if (payload.email) {
        userUpdatedData['email'] = payload.email;
      }

      const userRole = await transactionClient.role.findUnique({
        where: {
          id: payload.roleId,
        },
      });

      if (payload.roleId && userRole?.title !== USER_ROLE.CUSTOMER) {
        userUpdatedData['roleId'] = payload.roleId;
        delete payload['roleId'];
      }

      const updateUser = await transactionClient.user.update({
        where: {
          id: auth.userId,
        },
        data: userUpdatedData,
        include: {
          role: true,
        },
      });

      const updateCustomerAgent = await transactionClient.customerAgent.update({
        where: {
          userId: isUserExist?.id,
          email: isUserExist?.email,
        },
        data: payload,
      });

      profileData = {
        ...updateCustomerAgent,
        role: updateUser?.role?.title,
      };
    }

    return profileData;
  });

  return result;
};

export const UserService = {
  createCustomer,
  createAdmin,
  createSuperAdmin,
  createTechnician,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  getMyProfile,
  updateMyProfile,
};
