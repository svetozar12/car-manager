import express from 'express';
import { sendCode, verifyEmailCode } from './auth.controller';
import { sendCodeSchema, verifyCodeSchema } from './auth.schema';
import { messageResponse } from '../../utils/reqResponse';
import { User } from '../../db/mongo/models/User.model';
export const authRouter = express.Router();

authRouter.post('/sendCode', async (req, res) => {
  const { email } = sendCodeSchema.parse(req.body);
  await sendCode(email);
  return res.json(messageResponse('Code was sent successfully'));
});

authRouter.post('/verify', async (req, res) => {
  const { code, email } = verifyCodeSchema.parse(req.body);
  const isVerified = await verifyEmailCode({ code, email });
  if (!isVerified) return res.json(messageResponse('Invalid code')).status(401);

  // get the user
  let user = await User.findOne({ email }).lean();
  if (!user) {
    user = await User.create({ email, avatar: 'default' });
  }
  req.session.regenerate((err) => {
    if (err) return res.status(500).end();
    req.session.userId = String(user._id);
    // req.session.roles = user.roles;
    res.json({ ok: true, csrfToken: req.csrfToken() });
  });
});
