/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { TimeSlotService } from './timeSlot.service';
import pick from '../../../shared/pick';
import { timeSlotFilterableFields } from './timeSlot.constant';

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
  const filters = pick(req.query, timeSlotFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await TimeSlotService.getFromDB(filters, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Time slots fetched successfully !',
    data: result?.data,
    meta: result?.meta,
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

const availableTimeSlot = catchAsync(async (req: Request, res: Response) => {
  const { bookingDate } = req.query as any;
  const result = await TimeSlotService.availableTimeSlot(bookingDate);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Available time slots fetched successfully !',
    data: result,
  });
});

export const TimeSlotController = {
  insertIntoDB,
  getFromDB,
  getSingleFromDB,
  updateIntoDB,
  deleteFromDB,
  availableTimeSlot,
};
