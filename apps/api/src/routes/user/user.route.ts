import express from 'express';
import { getUsers } from './user.controller';
export const userRouter = express.Router();

userRouter.get('/', (req, res) => {
  return getUsers(req, res);
});
