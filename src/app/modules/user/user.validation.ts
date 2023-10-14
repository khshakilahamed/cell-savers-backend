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
        required_error: 'Email is required',
      })
      .email(),
    contactNo: z.string({
      required_error: 'Contact number is required',
    }),
    gender: z.enum(gender as [string, ...string[]], {
      required_error: 'Gender is required',
    }),
    profilePicture: z.string().optional(),
    emergencyContactNo: z.string().optional(),
    presentAddress: z.string().optional(),
    permanentAddress: z.string().optional(),
  }),
});

const createAdmin = z.object({
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
    gender: z.enum(gender as [string, ...string[]], {
      required_error: 'Gender is required',
    }),
    profilePicture: z.string().optional(),
    emergencyContactNo: z.string().optional(),
    presentAddress: z.string().optional(),
    permanentAddress: z.string().optional(),
  }),
});

const createSuperAdmin = z.object({
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
    gender: z.enum(gender as [string, ...string[]], {
      required_error: 'Gender is required',
    }),
    profilePicture: z.string().optional(),
    emergencyContactNo: z.string().optional(),
    presentAddress: z.string().optional(),
    permanentAddress: z.string().optional(),
  }),
});

const createTechnician = z.object({
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
    gender: z.enum(gender as [string, ...string[]], {
      required_error: 'Gender is required',
    }),
    profilePicture: z.string().optional(),
    emergencyContactNo: z.string().optional(),
    presentAddress: z.string({
      required_error: 'Present address is required',
    }),
    permanentAddress: z.string({
      required_error: 'Permanent address is required',
    }),
  }),
});

export const UserValidations = {
  createCustomer,
  createAdmin,
  createSuperAdmin,
  createTechnician,
};
