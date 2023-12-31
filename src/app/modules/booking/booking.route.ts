import express from 'express';
import { BookingController } from './booking.controller';
import validateRequest from '../../middlewares/validateRequest';
import { BookingValidations } from './booking.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '@prisma/client';
const router = express.Router();

router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.super_admin),
  BookingController.getAllFromDB,
);

router.get(
  '/customer-my-bookings',
  auth(USER_ROLE.customer),
  BookingController.customerMyBookings,
);

router.get(
  '/technician-bookings',
  auth(USER_ROLE.technician),
  BookingController.techniciansBooking,
);

router.get(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.super_admin),
  BookingController.getSingleFromDB,
);

router.post(
  '/',
  validateRequest(BookingValidations.create),
  auth(USER_ROLE.customer),
  BookingController.insertIntoDB,
);

router.patch(
  '/technician-my-booking',
  auth(USER_ROLE.technician),
  BookingController.updateTechnicianBooking,
);

router.patch(
  '/:id',
  validateRequest(BookingValidations.update),
  auth(USER_ROLE.admin, USER_ROLE.super_admin),
  BookingController.updateIntoDB,
);

router.patch(
  '/confirm-booking/:id',
  auth(USER_ROLE.customer, USER_ROLE.admin, USER_ROLE.super_admin),
  BookingController.confirmBooking,
);

router.patch(
  '/cancel-booking/:id',
  auth(USER_ROLE.customer, USER_ROLE.admin, USER_ROLE.super_admin),
  BookingController.cancelBooking,
);

router.delete(
  '/:id',
  auth(USER_ROLE.customer, USER_ROLE.admin, USER_ROLE.super_admin),
  BookingController.deleteFromDB,
);

export const bookingRoutes = router;
