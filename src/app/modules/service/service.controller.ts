/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ServiceOfService } from './service.service';
import pick from '../../../shared/pick';
import { serviceFilterableFields } from './service.constant';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const { ...serviceData } = req.body;

  const result = await ServiceOfService.insertIntoDB(serviceData);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Service created successfully !',
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, serviceFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await ServiceOfService.getAllFromDB(filters, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Services fetched successfully !',
    data: result?.data,
    meta: result?.meta,
  });
});

const getSingleFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ServiceOfService.getSingleFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Service fetched successfully !',
    data: result,
  });
});

const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { ...serviceData } = req.body;
  const result = await ServiceOfService.updateIntoDB(id, serviceData);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Service updated successfully !',
    data: result,
  });
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ServiceOfService.deleteFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Service deleted successfully !',
    data: result,
  });
});

export const ServiceController = {
  insertIntoDB,
  getAllFromDB,
  getSingleFromDB,
  updateIntoDB,
  deleteFromDB,
};
