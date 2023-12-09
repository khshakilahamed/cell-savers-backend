/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';

const createToken = (
  payload: Record<string, unknown>,
  secret: Secret,
  expireTime: string,
): string => {
  return jwt.sign(payload, secret, {
    expiresIn: expireTime,
  });
};

const passwordResetToken = (
  payload: Record<string, unknown>,
  secret: Secret,
  expireTime: string,
): string => {
  return jwt.sign(payload, secret, {
    algorithm: 'HS256',
    expiresIn: expireTime,
  });
};

const verifyToken = (token: string, secret: Secret): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
  // try {
  //   const isVerified = jwt.verify(token, secret);
  //   return isVerified as any;
  // } catch (error) {
  //   throw new ApiError(httpStatus.FORBIDDEN, 'Invalid token');
  // }
};

export const jwtHelpers = {
  createToken,
  passwordResetToken,
  verifyToken,
};
