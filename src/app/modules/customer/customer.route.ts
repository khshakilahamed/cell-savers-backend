import express from 'express';
import { CustomerController } from './customer.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '@prisma/client';
import validateRequest from '../../middlewares/validateRequest';
import { CustomerValidation } from './customer.validation';
import { UserValidations } from '../user/user.validation';
const router = express.Router();

router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.super_admin, USER_ROLE.technician),
  CustomerController.getFromDB,
);

router.get(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.super_admin, USER_ROLE.technician),
  CustomerController.getSingleFromDB,
);

router.post(
  '/',
  validateRequest(UserValidations.createUser),
  auth(USER_ROLE.admin, USER_ROLE.super_admin),
  CustomerController.createCustomer,
);

router.patch(
  '/:id',
  validateRequest(CustomerValidation.update),
  auth(USER_ROLE.admin, USER_ROLE.super_admin),
  CustomerController.updateIntoDB,
);

router.delete(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.super_admin),
  CustomerController.deleteFromDB,
);

export const customerRoutes = router;
