import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

/**
 * Middleware to authenticate the user using it's JWT token
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user as Record<string, any>;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};
