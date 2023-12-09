import { UserUtils } from '../user/user.utils';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { hashPasswordHelpers } from '../../../helpers/hashPasswordHelpers';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import config from '../../../config';
import { JwtPayload, Secret } from 'jsonwebtoken';
import {
  IChangePassword,
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
} from './auth.interface';
import prisma from '../../../shared/prisma';
import { USER_ROLE } from '@prisma/client';
import { CreateUserType } from '../user/user.interface';
import { sendEmail } from './auth.utils';

const customerRegister = async (
  payload: CreateUserType,
): Promise<ILoginUserResponse> => {
  const { password, ...othersData } = payload;

  const isExistUser = await UserUtils.isExistUser(payload.email);

  if (isExistUser) {
    throw new ApiError(httpStatus.CONFLICT, 'User already exist');
  }

  const hashedPassword = await hashPasswordHelpers.hashPassword(password);

  const userRole = await UserUtils.userRole(USER_ROLE.customer);

  if (!userRole) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User role not found');
  }

  const userData = {
    email: payload.email,
    roleId: userRole!.id,
    password: hashedPassword,
  };

  const result = await prisma.$transaction(async transactionClient => {
    const user = await transactionClient.user.create({
      data: userData,
      include: {
        role: true,
      },
    });

    const data = { ...othersData, userId: user.id };
    await transactionClient.customer.create({ data });

    const accessToken = jwtHelpers.createToken(
      { userId: user.id, email: user.email, role: user.role.title },
      config.jwt.secret as Secret,
      config.jwt.expires_in as string,
    );

    const refreshToken = jwtHelpers.createToken(
      { userId: user.id, email: user.email, role: user.role.title },
      config.jwt.refresh_secret as Secret,
      config.jwt.refresh_expires_in as string,
    );

    return {
      accessToken,
      refreshToken,
    };
  });

  return result;
};

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { email, password } = payload;

  const isExistUser = await UserUtils.isExistUser(email);

  if (!isExistUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not found');
  }

  const isPasswordMatched = await hashPasswordHelpers.isPasswordMatched(
    password,
    isExistUser.password,
  );

  if (!isPasswordMatched) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
  }

  //   console.log(isPasswordMatched);
  const accessToken = jwtHelpers.createToken(
    {
      userId: isExistUser.id,
      email: isExistUser.email,
      role: isExistUser.role.title,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );

  const refreshToken = jwtHelpers.createToken(
    {
      userId: isExistUser.id,
      email: isExistUser.email,
      role: isExistUser.role.title,
    },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  //verify token
  // invalid token - synchronous
  let verifiedToken = null;
  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret,
    );
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token');
  }

  const { email } = verifiedToken;

  const isExistUser = await UserUtils.isExistUser(email);

  if (!isExistUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not found');
  }

  const newAccessToken = jwtHelpers.createToken(
    {
      userId: isExistUser.id,
      email: isExistUser.email,
      role: isExistUser.role.title,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );

  return {
    accessToken: newAccessToken,
  };
};

const changePassword = async (
  user: JwtPayload | null,
  payload: IChangePassword,
) => {
  const email = user?.email;
  const isExistUser = await UserUtils.isExistUser(email);

  if (!isExistUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not found');
  }

  const { newPassword, oldPassword } = payload;

  const isPasswordMatched = await hashPasswordHelpers.isPasswordMatched(
    oldPassword,
    isExistUser.password,
  );

  if (!isPasswordMatched) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Old Password is incorrect');
  }

  const newHashPassword = await hashPasswordHelpers.hashPassword(newPassword);

  await prisma.user.update({
    where: {
      id: isExistUser.id,
      email: isExistUser.email,
    },
    data: {
      password: newHashPassword,
    },
  });

  //   console.log(isPasswordMatched);

  return 'Password Changed';
};

const forgotPassword = async (userEmail: string) => {
  const isExistUser = await UserUtils.isExistUser(userEmail);

  if (!isExistUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User Does not exist');
  }

  const passwordResetToken = jwtHelpers.passwordResetToken(
    { email: isExistUser.email },
    config.jwt.secret as Secret,
    '5m',
  );

  let profile = null;

  if (isExistUser.role.title === USER_ROLE.customer) {
    profile = await prisma.customer.findFirst({
      where: {
        userId: isExistUser.id,
      },
    });
  } else {
    profile = await prisma.customerAgent.findFirst({
      where: {
        userId: isExistUser.id,
      },
    });
  }

  const resetLink: string =
    config.reset_link +
    `email=${isExistUser?.email}&token=${passwordResetToken}`;

  await sendEmail(
    isExistUser?.email,
    `
    <div>
      <p>Hi, ${profile?.firstName} ${profile?.lastName}</p>
      <p>Your password reset link: <a href=${resetLink}>Click Here</a></p>
    </div>
  `,
  );

  return 'Check your email';
};

const resetPassword = async (
  payload: { email: string; newPassword: string },
  token: string,
) => {
  const isExistUser = await UserUtils.isExistUser(payload.email);

  if (!isExistUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User Does not exist');
  }

  jwtHelpers.verifyToken(token, config.jwt.secret as Secret);

  const hashedPassword = await hashPasswordHelpers.hashPassword(
    payload.newPassword,
  );

  await prisma.user.update({
    where: {
      email: payload.email,
    },
    data: {
      password: hashedPassword,
    },
  });

  return 'password recovered';
};

export const AuthService = {
  customerRegister,
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
