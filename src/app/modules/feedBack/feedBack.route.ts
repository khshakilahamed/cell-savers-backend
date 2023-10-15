import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '@prisma/client';
import validateRequest from '../../middlewares/validateRequest';
import { FeedbackController } from './feedBack.controller';
import { FeedbackValidation } from './feedBack.validation';
const router = express.Router();

router.get(
  '/',
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.TECHNICIAN),
  FeedbackController.getFromDB,
);
router.get(
  '/:id',
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.TECHNICIAN),
  FeedbackController.getSingleFromDB,
);
router.post(
  '/',
  validateRequest(FeedbackValidation.create),
  auth(USER_ROLE.CUSTOMER),
  FeedbackController.insertIntoDB,
);

router.patch(
  '/:id',
  validateRequest(FeedbackValidation.update),
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  FeedbackController.updateIntoDB,
);
router.delete(
  '/:id',
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  FeedbackController.deleteFromDB,
);

export const feedbackRoutes = router;
