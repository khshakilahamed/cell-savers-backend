import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '@prisma/client';
import { BlogController } from './blog.controller';
import validateRequest from '../../middlewares/validateRequest';
import { BlogValidation } from './blog.validation';
const router = express.Router();

router.get('/', BlogController.getFromDB);
router.get('/:id', BlogController.getSingleFromDB);
router.post(
  '/',
  validateRequest(BlogValidation.create),
  auth(USER_ROLE.admin),
  BlogController.insertIntoDB,
);

router.patch(
  '/:id',
  validateRequest(BlogValidation.update),
  auth(USER_ROLE.admin),
  BlogController.updateIntoDB,
);
router.delete('/:id', auth(USER_ROLE.admin), BlogController.deleteFromDB);

export const blogRoutes = router;
