/* eslint-disable @typescript-eslint/no-explicit-any */
import express from 'express';
import { userRoutes } from '../modules/user/user.route';
import { authRoutes } from '../modules/auth/auth.route';
import { roleRoutes } from '../modules/role/role.route';
import { blogRoutes } from '../modules/blog/blog.route';
import { faqRoutes } from '../modules/faq/faq.route';
import { feedbackRoutes } from '../modules/feedBack/feedBack.route';

const router = express.Router();

const moduleRoutes: any[] = [
  {
    path: '/users',
    route: userRoutes,
  },
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/roles',
    route: roleRoutes,
  },
  {
    path: '/blogs',
    route: blogRoutes,
  },
  {
    path: '/faqs',
    route: faqRoutes,
  },
  {
    path: '/feedbacks',
    route: feedbackRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
