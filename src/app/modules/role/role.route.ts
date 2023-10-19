import express from 'express';
import { RoleController } from './role.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '@prisma/client';

const router = express.Router();

router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.super_admin),
  RoleController.getAllFromDB,
);
router.post(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.super_admin),
  RoleController.insertIntoDB,
);

export const roleRoutes = router;
