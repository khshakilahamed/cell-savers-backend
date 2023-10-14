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
    { email: isExistUser.email, role: isExistUser.role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );

  const refreshToken = jwtHelpers.createToken(
    { email: isExistUser.email, role: isExistUser.role },
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
    { email: isExistUser.email, role: isExistUser.role },
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
      email: isExistUser.email,
      role: isExistUser.role,
    },
    data: {
      password: newHashPassword,
    },
  });

  //   console.log(isPasswordMatched);
};

export const AuthService = { loginUser, refreshToken, changePassword };
