import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '@prisma/client';
import { CustomerAgentController } from './customerAgent.controller';
import { CustomerAgentValidation } from './customerAgent.validation';
import validateRequest from '../../middlewares/validateRequest';
const router = express.Router();

router.get(
  '/',
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  CustomerAgentController.getFromDB,
);

router.get(
  '/available-technician',
  // auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  CustomerAgentController.getAvailableTechnician,
);

router.get(
  '/:id',
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  CustomerAgentController.getSingleFromDB,
);

router.patch(
  '/:id',
  validateRequest(CustomerAgentValidation.update),
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  CustomerAgentController.updateIntoDB,
);

router.delete(
  '/:id',
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  CustomerAgentController.deleteFromDB,
);

export const customerAgentRoutes = router;
