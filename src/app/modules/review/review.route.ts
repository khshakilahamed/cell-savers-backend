import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '@prisma/client';
import validateRequest from '../../middlewares/validateRequest';
import { ReviewController } from './review.controller';
import { ReviewValidation } from './review.validation';
const router = express.Router();

router.get(
  '/:id',
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  ReviewController.getSingleFromDB,
);

router.get(
  '/',
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  ReviewController.getFromDB,
);

router.post(
  '/',
  validateRequest(ReviewValidation.create),
  auth(USER_ROLE.CUSTOMER),
  ReviewController.insertIntoDB,
);

router.patch(
  '/:id',
  validateRequest(ReviewValidation.update),
  auth(USER_ROLE.CUSTOMER),
  ReviewController.updateIntoDB,
);

router.delete(
  '/:id',
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  ReviewController.deleteFromDB,
);

export const reviewRoutes = router;
