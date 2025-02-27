import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import config from '../../../config';
import { IRefreshTokenResponse } from './auth.interface';

const customerRegister = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.customerRegister(req.body);

  const { refreshToken, accessToken } = result;

  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User registered successfully',
    data: { accessToken },
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.loginUser(req.body);

  const { refreshToken, accessToken } = result;

  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged in successfully',
    data: { accessToken },
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  // console.log('token');

  const result = await AuthService.refreshToken(refreshToken);

  sendResponse<IRefreshTokenResponse>(res, {
    statusCode: 200,
    success: true,
    message: 'User logged in successfully !',
    data: result,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const { ...passwordData } = req.body;

  const result = await AuthService.changePassword(user, passwordData);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Password changed successfully !',
    data: result,
  });
});

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;

  const result = await AuthService.forgotPassword(email);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Reset token sent to email',
    data: result,
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const { email, newPassword, token } = req.body;

  const result = await AuthService.resetPassword({ email, newPassword }, token);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Password recovered',
    data: result,
  });
});

export const AuthController = {
  customerRegister,
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
