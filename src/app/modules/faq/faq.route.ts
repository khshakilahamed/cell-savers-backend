import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '@prisma/client';
import { FaqController } from './faq.controller';
import validateRequest from '../../middlewares/validateRequest';
import { FAQValidation } from './faq.validation';
const router = express.Router();

router.get('/', FaqController.getFromDB);
router.get('/:id', FaqController.getSingleFromDB);
router.post(
  '/',
  validateRequest(FAQValidation.create),
  auth(USER_ROLE.admin, USER_ROLE.super_admin),
  FaqController.insertIntoDB,
);

router.patch(
  '/:id',
  validateRequest(FAQValidation.update),
  auth(USER_ROLE.admin, USER_ROLE.super_admin),
  FaqController.updateIntoDB,
);
router.delete(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.super_admin),
  FaqController.deleteFromDB,
);

export const faqRoutes = router;
