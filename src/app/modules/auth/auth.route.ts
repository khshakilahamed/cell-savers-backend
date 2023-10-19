import express from 'express';
import { AuthController } from './auth.controller';
import validateRequest from '../../middlewares/validateRequest';
import { AuthValidation } from './auth.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '@prisma/client';
import { UserValidations } from '../user/user.validation';

const router = express.Router();

router.post(
  '/register',
  validateRequest(UserValidations.createUser),
  AuthController.customerRegister,
);

router.post(
  '/login',
  validateRequest(AuthValidation.loginUser),
  AuthController.loginUser,
);

router.post(
  '/refresh-token',
  validateRequest(AuthValidation.refreshTokenZodSchema),
  AuthController.refreshToken,
);

router.post(
  '/change-password',
  validateRequest(AuthValidation.changePassword),
  auth(
    USER_ROLE.admin,
    USER_ROLE.super_admin,
    USER_ROLE.technician,
    USER_ROLE.customer,
  ),
  AuthController.changePassword,
);

export const authRoutes = router;
