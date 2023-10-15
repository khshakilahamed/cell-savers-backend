/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { FeedbackService } from './feedBack.service';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user as any;
  const { ...blogData } = req.body;

  const result = await FeedbackService.insertIntoDB(userId, blogData);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Feedback created successfully !',
    data: result,
  });
});

const getFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await FeedbackService.getFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Feedbacks fetched successfully!',
    data: result,
  });
});

const getSingleFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await FeedbackService.getSingleFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Feedback fetched successfully!',
    data: result,
  });
});

const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { ...blogData } = req.body;
  const result = await FeedbackService.updateIntoDB(id, blogData);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Feedback updated successfully!',
    data: result,
  });
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await FeedbackService.deleteFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Feedback deleted successfully!',
    data: result,
  });
});

export const FeedbackController = {
  insertIntoDB,
  getFromDB,
  getSingleFromDB,
  updateIntoDB,
  deleteFromDB,
};
