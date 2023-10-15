/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { TimeSlotService } from './timeSlot.service';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const { ...timeSlotData } = req.body;

  const result = await TimeSlotService.insertIntoDB(timeSlotData);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Time slot created successfully !',
    data: result,
  });
});

const getFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await TimeSlotService.getFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Time slots fetched successfully !',
    data: result,
  });
});

const getSingleFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TimeSlotService.getSingleFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Time slot fetched successfully !',
    data: result,
  });
});

const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { ...timeSlotData } = req.body;
  const result = await TimeSlotService.updateIntoDB(id, timeSlotData);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Time slot updated successfully !',
    data: result,
  });
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TimeSlotService.deleteFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Time slot deleted successfully !',
    data: result,
  });
});

export const TimeSlotController = {
  insertIntoDB,
  getFromDB,
  getSingleFromDB,
  updateIntoDB,
  deleteFromDB,
};
