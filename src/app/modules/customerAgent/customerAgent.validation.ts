import { z } from 'zod';
import { gender } from '../../../constants/global';

const update = z.object({
  body: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().email().optional(),
    contactNo: z.string().optional(),
    gender: z.enum(gender as [string, ...string[]]).optional(),
    profilePicture: z.string().optional(),
    emergencyContactNo: z.string().optional(),
    presentAddress: z.string().optional(),
    permanentAddress: z.string().optional(),
    roleId: z.string().optional(),
  }),
});

export const CustomerAgentValidation = { update };
