import { z } from 'zod';
import { gender } from '../../../constants/global';

const createUser = z.object({
  body: z.object({
    firstName: z.string({
      required_error: 'First Name is required',
    }),
    lastName: z.string({
      required_error: 'Last Name is required',
    }),
    password: z.string({
      required_error: 'Password is required',
    }),
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email(),
    contactNo: z.string({
      required_error: 'Contact number is required',
    }),
    // roleId: z.string({ required_error: 'Role id is required' }),
    gender: z.enum(gender as [string, ...string[]]).optional(),
    profilePicture: z.string().optional(),
    emergencyContactNo: z.string().optional(),
    presentAddress: z.string().optional(),
    permanentAddress: z.string().optional(),
  }),
});

export const UserValidations = {
  createUser,
};
