import bcrypt from 'bcrypt';
import config from '../config';

const hashPassword = async (password: string): Promise<string> => {
  const newPassword = bcrypt.hash(password, Number(config.bycrypt_salt_rounds));

  return newPassword;
};

const isPasswordMatched = async (password: string, hashedPassword: string) => {
  const result = await bcrypt.compare(password, hashedPassword);

  return result;
};

export const hashPasswordHelpers = {
  hashPassword,
  isPasswordMatched,
};
