/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { CustomerService } from './customer.service';
import pick from '../../../shared/pick';
import { customerFilterableFields } from './customer.constant';

const getFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, customerFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

  const result = await CustomerService.getFromDB(filters, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Customers fetched successfully!',
    data: result,
  });
});

const getSingleFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params as any;

  const result = await CustomerService.getSingleFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Customer fetched successfully!',
    data: result,
  });
});

const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params as any;

  const { ...customerData } = req.body;

  const result = await CustomerService.updateIntoDB(id, customerData);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Customer updated successfully!',
    data: result,
  });
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params as any;

  const result = await CustomerService.deleteFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Customer deleted successfully!',
    data: result,
  });
});

export const CustomerController = {
  getFromDB,
  getSingleFromDB,
  updateIntoDB,
  deleteFromDB,
};
