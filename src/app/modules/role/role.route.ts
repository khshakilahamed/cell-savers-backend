import express from 'express';
import { RoleController } from './role.controller';

const router = express.Router();

router.get('/', RoleController.getAllFromDB);
router.post('/', RoleController.insertIntoDB);

export const roleRoutes = router;
