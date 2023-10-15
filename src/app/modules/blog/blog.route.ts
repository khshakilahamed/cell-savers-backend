import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '@prisma/client';
import { BlogController } from './blog.controller';
const router = express.Router();

router.get('/', BlogController.getFromDB);
router.get('/:id', BlogController.getSingleFromDB);
router.post('/', auth(USER_ROLE.ADMIN), BlogController.insertIntoDB);

router.patch('/:id', auth(USER_ROLE.ADMIN), BlogController.updateIntoDB);
router.delete('/:id', auth(USER_ROLE.ADMIN), BlogController.deleteFromDB);

export const blogRoutes = router;
