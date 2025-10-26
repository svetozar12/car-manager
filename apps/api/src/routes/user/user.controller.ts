import { Request, Response } from 'express';

export function getUsers(_: Request, res: Response) {
  return res.status(200).json({
    message: 'users',
  });
}
