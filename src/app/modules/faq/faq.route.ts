import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '@prisma/client';
import { FaqController } from './faq.controller';
const router = express.Router();

router.get('/', FaqController.getFromDB);
router.get('/:id', FaqController.getSingleFromDB);
router.post('/', auth(USER_ROLE.ADMIN), FaqController.insertIntoDB);

router.patch('/:id', auth(USER_ROLE.ADMIN), FaqController.updateIntoDB);
router.delete('/:id', auth(USER_ROLE.ADMIN), FaqController.deleteFromDB);

export const faqRoutes = router;
