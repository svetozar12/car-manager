import express from 'express';
import { getCars } from './car.controller';
export const carRouter = express.Router();

carRouter.get('/', (req, res) => {
  return getCars(req, res);
});
