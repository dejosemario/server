import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../utils';

export const isAuthUser = (req: Request, res: Response, next: NextFunction) => {
  const cookieName = process.env.PASSWORD_COOKIE_NAME as string;
  const token = req.cookies[cookieName];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  try {
    const payload = verifyToken(token);

    (req as any).user = {};
    (req as any).user = payload;
    // console.log((req as any).user);
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: 'Invalid or expired OTP code' });
  }
};

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const cookieName = process.env.ACCESS_TOKEN_NAME as string;
  const token = req.cookies[cookieName];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  try {
    const payload = verifyToken(token);
    (req as any).user = {};
    (req as any).user.id = payload.id;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: 'Invalid or expired token' });
  }
};
export default isAuthenticated;
