import { User } from '@prisma/client';
import prisma from '../../../shared/prisma';

const isExistUser = async (email: string): Promise<User | null> => {
  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  return user;
};

export const UserUtils = { isExistUser };
