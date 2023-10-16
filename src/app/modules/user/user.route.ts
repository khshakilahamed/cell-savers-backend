import express from 'express';
import { UserController } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidations } from './user.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '@prisma/client';

const router = express.Router();

router.get(
  '/',
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  UserController.getAllUsers,
);

router.get(
  '/super-admins',
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  UserController.getAllSuperAdmins,
);

router.get(
  '/admins',
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  UserController.getAllAdmins,
);

router.get(
  '/technicians',
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  UserController.getAllTechnicians,
);

router.get(
  '/my-profile',
  auth(
    USER_ROLE.CUSTOMER,
    USER_ROLE.TECHNICIAN,
    USER_ROLE.ADMIN,
    USER_ROLE.SUPER_ADMIN,
  ),
  UserController.getMyProfile,
);

router.get(
  '/:id',
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  UserController.getSingleUser,
);

router.post(
  '/create-customer',
  validateRequest(UserValidations.createUser),
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  UserController.createCustomer,
);

router.post(
  '/create-admin',
  validateRequest(UserValidations.createUser),
  auth(USER_ROLE.SUPER_ADMIN),
  UserController.createAdmin,
);

router.post(
  '/create-super-admin',
  validateRequest(UserValidations.createUser),
  auth(USER_ROLE.SUPER_ADMIN),
  UserController.createSuperAdmin,
);

router.post(
  '/create-technician',
  validateRequest(UserValidations.createUser),
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  UserController.createTechnician,
);

router.patch(
  '/update-my-profile',
  validateRequest(UserValidations.update),
  auth(
    USER_ROLE.CUSTOMER,
    USER_ROLE.TECHNICIAN,
    USER_ROLE.ADMIN,
    USER_ROLE.SUPER_ADMIN,
  ),
  UserController.updateMyProfile,
);

router.patch(
  '/:id',
  validateRequest(UserValidations.update),
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  UserController.updateUser,
);

router.delete(
  '/:id',
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  UserController.deleteUser,
);

export const userRoutes = router;
