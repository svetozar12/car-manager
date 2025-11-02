import { Request, Response } from 'express';
import { logger } from '../../utils/logger';

export async function getCars(_: Request, res: Response) {
  return res.status(200).json({ data: [] });
}
