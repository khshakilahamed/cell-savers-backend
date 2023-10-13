import { z } from 'zod';
import { gender } from '../../../constants/global';

const createCustomer = z.object({
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
        required_error: 'Last Name is required',
      })
      .email(),
    profilePicture: z.string().optional(),
    gender: z.enum(gender as [string, ...string[]], {
      required_error: 'Gender is required',
    }),
    contactNo: z.string({
      required_error: 'Contact number is required',
    }),
    emergencyContactNo: z.string().optional(),
    presentAddress: z.string().optional(),
    permanentAddress: z.string().optional(),
  }),
});

export const UserValidations = { createCustomer };
