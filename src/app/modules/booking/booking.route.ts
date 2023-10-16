import express from 'express';
import { BookingController } from './booking.controller';
import validateRequest from '../../middlewares/validateRequest';
import { BookingValidations } from './booking.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '@prisma/client';
const router = express.Router();

router.get(
  '/',
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  BookingController.getAllFromDB,
);

router.get(
  '/:id',
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  BookingController.getSingleFromDB,
);

router.post(
  '/',
  validateRequest(BookingValidations.create),
  auth(USER_ROLE.CUSTOMER),
  BookingController.insertIntoDB,
);

router.patch(
  '/:id',
  validateRequest(BookingValidations.update),
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  BookingController.updateIntoDB,
);

router.delete(
  '/:id',
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  BookingController.deleteFromDB,
);

export const bookingRoutes = router;
