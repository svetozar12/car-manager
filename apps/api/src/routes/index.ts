import express from 'express';
import { userRouter } from './user/user.route';
import { carRouter } from './car/car.route';
import { authRouter } from './auth/auth.route';
export const router = express.Router();

router.get('/', (_, res) => {
  res.status(200).json({
    status: 'operational',
    message: 'Car Manager API',
  });
});

const routes = [
  { route: '/user', routerInstance: userRouter },
  { route: '/auth', routerInstance: authRouter },
  // { route: '/car', routerInstance: carRouter },
];

routes.forEach(({ route, routerInstance }) =>
  router.use(route, routerInstance),
);
