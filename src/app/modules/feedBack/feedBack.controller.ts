/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { FeedbackService } from './feedBack.service';
import { feedbackFilterableFields } from './feedBack.constant';
import pick from '../../../shared/pick';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user as any;
  const { ...feedbackData } = req.body;

  const result = await FeedbackService.insertIntoDB(userId, feedbackData);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Feedback created successfully !',
    data: result,
  });
});

const getFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, feedbackFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await FeedbackService.getFromDB(filters, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Feedbacks fetched successfully!',
    data: result?.data,
    meta: result?.meta,
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

const selectFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await FeedbackService.selectFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Feedback selected successfully!',
    data: result,
  });
});

export const FeedbackController = {
  insertIntoDB,
  getFromDB,
  getSingleFromDB,
  updateIntoDB,
  deleteFromDB,
  selectFromDB,
};
