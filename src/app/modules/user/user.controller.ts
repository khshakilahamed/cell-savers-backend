/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { UserService } from './user.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';

const createCustomer = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createCustomer(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Customer created successfully',
    data: result,
  });
});

export const UserController = { createCustomer };
