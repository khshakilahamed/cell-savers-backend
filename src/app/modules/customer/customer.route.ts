import express from 'express';
import { CustomerController } from './customer.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '@prisma/client';
import validateRequest from '../../middlewares/validateRequest';
import { CustomerValidation } from './customer.validation';
const router = express.Router();

router.get(
  '/',
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.TECHNICIAN),
  CustomerController.getFromDB,
);

router.get(
  '/:id',
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.TECHNICIAN),
  CustomerController.getSingleFromDB,
);

router.patch(
  '/:id',
  validateRequest(CustomerValidation.update),
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  CustomerController.updateIntoDB,
);

router.delete(
  '/:id',
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  CustomerController.deleteFromDB,
);

export const customerRoutes = router;
