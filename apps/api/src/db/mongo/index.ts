import mongoose, { Schema } from 'mongoose';
import { logger } from '../../utils/logger';
import { Envs } from '../../utils/env';

const userSchema = new Schema({
  name: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);
run().catch((err) => console.log(err));

export async function disconnect() {
  return mongoose.connection.getClient().close();
}

async function run() {
  logger.debug('test');
  if (mongoose.connection.readyState === 1)
    return logger.info('Already connected to mongo');

  if (mongoose.connection.readyState === 2) {
    await new Promise((res) => mongoose.connection.once('connected', res));

    return logger.info('connecting to mongo');
  }
  logger.info('Not connected to mongo, trying to connect');
  await mongoose.connect(Envs.MONGO_URL);

  logger.info('connected to mongo');

  const cat = new User({
    name: 'Bill',
  });
  await cat.save();
}
