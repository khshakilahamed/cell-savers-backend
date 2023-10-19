import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '@prisma/client';
import validateRequest from '../../middlewares/validateRequest';
import { TimeSlotController } from './timeSlot.controller';
import { TimeSlotValidation } from './timeSlot.validation';
const router = express.Router();

router.get('/', TimeSlotController.getFromDB);
router.get('/available-time-slot', TimeSlotController.availableTimeSlot);
router.get('/:id', TimeSlotController.getSingleFromDB);

router.post(
  '/',
  validateRequest(TimeSlotValidation.create),
  auth(USER_ROLE.admin, USER_ROLE.super_admin),
  TimeSlotController.insertIntoDB,
);

router.patch(
  '/:id',
  validateRequest(TimeSlotValidation.update),
  auth(USER_ROLE.admin, USER_ROLE.super_admin),
  TimeSlotController.updateIntoDB,
);

router.delete(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.super_admin),
  TimeSlotController.deleteFromDB,
);

export const timeSlotRoutes = router;
