import express from 'express';
import { UserController } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidations } from './user.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '@prisma/client';

const router = express.Router();

router.get('/', UserController.getAllUsers);

router.post(
  '/create-customer',
  validateRequest(UserValidations.createCustomer),
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  UserController.createCustomer,
);

router.post(
  '/create-admin',
  validateRequest(UserValidations.createAdmin),
  auth(USER_ROLE.SUPER_ADMIN),
  UserController.createAdmin,
);

router.post(
  '/create-super-admin',
  validateRequest(UserValidations.createSuperAdmin),
  auth(USER_ROLE.SUPER_ADMIN),
  UserController.createSuperAdmin,
);

router.post(
  '/create-technician',
  validateRequest(UserValidations.createTechnician),
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  UserController.createTechnician,
);

export const userRoutes = router;
