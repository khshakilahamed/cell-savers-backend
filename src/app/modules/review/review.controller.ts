/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ReviewService } from './review.service';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as any;
  const { ...blogData } = req.body;

  const result = await ReviewService.insertIntoDB(user, blogData);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Review created successfully !',
    data: result,
  });
});

const getFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.getFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Reviews fetched successfully !',
    data: result,
  });
});

const getSingleFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ReviewService.getSingleFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Review fetched successfully !',
    data: result,
  });
});

const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { ...reviewData } = req.body;
  const result = await ReviewService.updateIntoDB(id, reviewData);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Review updated successfully !',
    data: result,
  });
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ReviewService.deleteFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Review deleted successfully !',
    data: result,
  });
});

export const ReviewController = {
  insertIntoDB,
  getFromDB,
  getSingleFromDB,
  updateIntoDB,
  deleteFromDB,
};
