import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '@prisma/client';
import validateRequest from '../../middlewares/validateRequest';
import { ReviewController } from './review.controller';
import { ReviewValidation } from './review.validation';
const router = express.Router();

router.get(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.super_admin),
  ReviewController.getSingleFromDB,
);

router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.super_admin),
  ReviewController.getFromDB,
);

router.post(
  '/',
  validateRequest(ReviewValidation.create),
  auth(USER_ROLE.customer),
  ReviewController.insertIntoDB,
);

router.patch(
  '/:id',
  validateRequest(ReviewValidation.update),
  auth(USER_ROLE.customer),
  ReviewController.updateIntoDB,
);

router.delete(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.super_admin),
  ReviewController.deleteFromDB,
);

export const reviewRoutes = router;
