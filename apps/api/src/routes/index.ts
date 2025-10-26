import express from 'express';
import { userRouter } from './user/user.route';
export const router = express.Router();

router.get('/', (_, res) => {
  res.status(200).json({
    status: 'operational',
    message: 'Car Manager API',
  });
});

const routes = [{ route: '/user', routerInstance: userRouter }];
routes.forEach(({ route, routerInstance }) =>
  router.use(route, routerInstance),
);
