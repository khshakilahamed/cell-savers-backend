/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import pick from '../../../shared/pick';
import { customerAgentFilterableFields } from './customerAgent.constant';
import { CustomerAgentService } from './customerAgent.service';

const getFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, customerAgentFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

  const result = await CustomerAgentService.getFromDB(filters, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Customer agents fetched successfully!',
    data: result,
  });
});

const getSingleFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params as any;

  const result = await CustomerAgentService.getSingleFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Customer agents fetched successfully!',
    data: result,
  });
});

const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params as any;

  const { ...customerData } = req.body;

  const result = await CustomerAgentService.updateIntoDB(id, customerData);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Customer agents updated successfully!',
    data: result,
  });
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params as any;

  const result = await CustomerAgentService.deleteFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Customer agents deleted successfully!',
    data: result,
  });
});

const getAvailableTechnician = catchAsync(
  async (req: Request, res: Response) => {
    const { bookingDate, timeSlot } = req.query as any;

    const result = await CustomerAgentService.getAvailableTechnician({
      bookingDate,
      timeSlot,
    });

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Customer agents deleted successfully!',
      data: result,
    });
  },
);

export const CustomerAgentController = {
  getFromDB,
  getSingleFromDB,
  updateIntoDB,
  deleteFromDB,
  getAvailableTechnician,
};
