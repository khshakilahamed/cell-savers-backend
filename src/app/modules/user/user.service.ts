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

  const userRole = await UserUtils.userRole(USER_ROLE.customer);

  if (!userRole) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User role does not found');
  }

  const userData = {
    email: payload.email,
    roleId: userRole.id,
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
  const userRole = await UserUtils.userRole(USER_ROLE.admin);

  if (!userRole) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User role does not found');
  }

  payload['roleId'] = userRole!.id;

  const result = await UserUtils.createAgent(payload);

  return result;
};

const createSuperAdmin = async (
  payload: CreateUserType,
): Promise<Partial<User>> => {
  const userRole = await UserUtils.userRole(USER_ROLE.super_admin);

  if (!userRole) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User role does not found');
  }

  payload['roleId'] = userRole!.id;

  const result = await UserUtils.createAgent(payload);

  return result;
};

const createTechnician = async (
  payload: CreateUserType,
): Promise<Partial<User>> => {
  const userRole = await UserUtils.userRole(USER_ROLE.technician);

  if (!userRole) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User role does not found');
  }

  payload['roleId'] = userRole!.id;

  const result = await UserUtils.createAgent(payload);

  return result;
};

const getAllUsers = async (): Promise<Partial<User>[]> => {
  const result = await prisma.user.findMany({
    select: userSelectOptions,
  });

  return result;
};

const getAllSuperAdmins = async () => {
  const customerAgents = await prisma.customerAgent.findMany({
    include: {
      user: {
        select: {
          email: true,
          role: true,
          roleId: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });

  const result = customerAgents.filter(
    agent => agent?.user?.role.title === USER_ROLE.super_admin,
  );

  return result;
};

const getAllAdmins = async () => {
  const customerAgents = await prisma.customerAgent.findMany({
    include: {
      user: {
        select: {
          email: true,
          role: true,
          roleId: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });

  const result = customerAgents.filter(
    agent => agent?.user?.role.title === USER_ROLE.admin,
  );

  return result;
};

const getAllTechnicians = async () => {
  const customerAgents = await prisma.customerAgent.findMany({
    include: {
      user: {
        select: {
          email: true,
          role: true,
          roleId: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });

  const result = customerAgents.filter(
    agent => agent?.user?.role.title === USER_ROLE.technician,
  );

  return result;
};

const getAllCustomers = async () => {
  const result = await prisma.customer.findMany({
    include: {
      user: {
        select: {
          email: true,
          role: true,
          roleId: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
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

  if (isExistUser.role.title === USER_ROLE.customer) {
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
    if (isExistUser.role.title === USER_ROLE.customer) {
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
  const isUserExist = await prisma.user.findFirst({
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

  let profileData = {};

  if (isUserExist?.role.title === USER_ROLE.customer) {
    const customer = await prisma.customer.findFirst({
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
    const customer = await prisma.customerAgent.findFirst({
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
};

const updateMyProfile = async (
  auth: IUserAuthPayload,
  payload: Partial<CreateUserType>,
) => {
  const isUserExist = await prisma.user.findFirst({
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

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  let profileData = {};

  if (isUserExist?.role.title === USER_ROLE.customer) {
    if (payload.email) {
      delete payload['email'];
    }

    const customerWhereUniqueInput: Prisma.CustomerWhereUniqueInput = {
      userId: isUserExist.id,
      email: isUserExist.email,
    };

    const customer = await prisma.customer.update({
      where: customerWhereUniqueInput,
      data: payload,
    });

    profileData = {
      ...customer,
      role: isUserExist?.role?.title,
    };
    return profileData;
  } else {
    const userUpdatedData: Partial<User> = {};

    if (payload.email) {
      userUpdatedData['email'] = payload.email;
    }
    if (payload.roleId) {
      delete payload['roleId'];
    }

    if (payload?.email && payload?.email !== isUserExist.email) {
      const isEmailAlreadyExist = await prisma.user.findFirst({
        where: {
          email: payload.email,
        },
      });
      if (isEmailAlreadyExist) {
        throw new ApiError(httpStatus.CONFLICT, 'This email already exist');
      }
    }

    await prisma.$transaction(async transactionClient => {
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
    });

    return profileData;
  }
};

export const UserService = {
  createCustomer,
  createAdmin,
  createSuperAdmin,
  createTechnician,
  getAllUsers,
  getAllSuperAdmins,
  getAllAdmins,
  getAllTechnicians,
  getAllCustomers,
  getSingleUser,
  updateUser,
  deleteUser,
  getMyProfile,
  updateMyProfile,
};
