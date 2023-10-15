import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { RoleService } from './role.service';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await RoleService.insertIntoDB(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Role created successfully !',
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await RoleService.getAllFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Role fetched successfully !',
    data: result,
  });
});

export const RoleController = { insertIntoDB, getAllFromDB };
