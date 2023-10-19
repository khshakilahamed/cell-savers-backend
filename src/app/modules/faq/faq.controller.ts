/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { FaqService } from './faq.service';
import pick from '../../../shared/pick';
import { faqFilterableFields } from './faq.constant';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user as any;
  const { ...blogData } = req.body;

  const result = await FaqService.insertIntoDB(userId, blogData);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'FAQ created successfully !',
    data: result,
  });
});

const getFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, faqFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

  const result = await FaqService.getFromDB(filters, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'FAQs fetched successfully!',
    data: result?.data,
    meta: result?.meta,
  });
});

const getSingleFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await FaqService.getSingleFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'FAQ fetched successfully!',
    data: result,
  });
});

const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { ...blogData } = req.body;
  const result = await FaqService.updateIntoDB(id, blogData);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'FAQ updated successfully!',
    data: result,
  });
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await FaqService.deleteFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'FAQ deleted successfully!',
    data: result,
  });
});

export const FaqController = {
  insertIntoDB,
  getFromDB,
  getSingleFromDB,
  updateIntoDB,
  deleteFromDB,
};
