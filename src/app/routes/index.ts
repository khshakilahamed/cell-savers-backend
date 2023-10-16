/* eslint-disable @typescript-eslint/no-explicit-any */
import express from 'express';
import { userRoutes } from '../modules/user/user.route';
import { authRoutes } from '../modules/auth/auth.route';
import { roleRoutes } from '../modules/role/role.route';
import { blogRoutes } from '../modules/blog/blog.route';
import { faqRoutes } from '../modules/faq/faq.route';
import { feedbackRoutes } from '../modules/feedBack/feedBack.route';
import { timeSlotRoutes } from '../modules/timeSlot/timeSlot.route';
import { serviceRoutes } from '../modules/service/service.route';
import { bookingRoutes } from '../modules/booking/booking.route';
import { reviewRoutes } from '../modules/review/review.route';

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
  {
    path: '/time-slots',
    route: timeSlotRoutes,
  },
  {
    path: '/services',
    route: serviceRoutes,
  },
  {
    path: '/bookings',
    route: bookingRoutes,
  },
  {
    path: '/reviews',
    route: reviewRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
