import express from 'express';
import { UserController } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidations } from './user.validation';

const router = express.Router();

router.post(
  '/create-customer',
  validateRequest(UserValidations.createCustomer),
  UserController.createCustomer,
);

export const userRoutes = router;
