import express from 'express';
import { UserController } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidations } from './user.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '@prisma/client';

const router = express.Router();

router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.super_admin),
  UserController.getAllUsers,
);

router.get(
  '/super-admins',
  auth(USER_ROLE.admin, USER_ROLE.super_admin),
  UserController.getAllSuperAdmins,
);

router.get(
  '/admins',
  auth(USER_ROLE.admin, USER_ROLE.super_admin),
  UserController.getAllAdmins,
);

router.get(
  '/technicians',
  auth(USER_ROLE.admin, USER_ROLE.super_admin),
  UserController.getAllTechnicians,
);

router.get(
  '/my-profile',
  auth(
    USER_ROLE.customer,
    USER_ROLE.technician,
    USER_ROLE.admin,
    USER_ROLE.super_admin,
  ),
  UserController.getMyProfile,
);

router.get(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.super_admin),
  UserController.getSingleUser,
);

router.post(
  '/create-customer',
  validateRequest(UserValidations.createUser),
  // auth(USER_ROLE.admin, USER_ROLE.super_admin),
  UserController.createCustomer,
);

router.post(
  '/create-admin',
  validateRequest(UserValidations.createUser),
  // auth(USER_ROLE.super_admin),
  UserController.createAdmin,
);

router.post(
  '/create-super-admin',
  validateRequest(UserValidations.createUser),
  // auth(USER_ROLE.super_admin),
  UserController.createSuperAdmin,
);

router.post(
  '/create-technician',
  validateRequest(UserValidations.createUser),
  // auth(USER_ROLE.admin, USER_ROLE.super_admin),
  UserController.createTechnician,
);

router.patch(
  '/update-my-profile',
  validateRequest(UserValidations.update),
  auth(
    USER_ROLE.customer,
    USER_ROLE.technician,
    USER_ROLE.admin,
    USER_ROLE.super_admin,
  ),
  UserController.updateMyProfile,
);

router.patch(
  '/:id',
  validateRequest(UserValidations.update),
  auth(USER_ROLE.admin, USER_ROLE.super_admin),
  UserController.updateUser,
);

router.delete(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.super_admin),
  UserController.deleteUser,
);

export const userRoutes = router;
