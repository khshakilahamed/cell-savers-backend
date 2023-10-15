import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '@prisma/client';
import validateRequest from '../../middlewares/validateRequest';
import { ServiceController } from './service.controller';
import { ServiceValidation } from './service.validation';
const router = express.Router();

router.get('/', ServiceController.getAllFromDB);
router.get('/:id', ServiceController.getSingleFromDB);

router.post(
  '/',
  validateRequest(ServiceValidation.create),
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  ServiceController.insertIntoDB,
);

router.patch(
  '/:id',
  validateRequest(ServiceValidation.update),
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  ServiceController.updateIntoDB,
);

router.delete(
  '/:id',
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  ServiceController.deleteFromDB,
);

export const serviceRoutes = router;
