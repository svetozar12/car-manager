import { describe, after, before } from 'node:test';
import app, { ready } from '../src/app';
import supertest from 'supertest';
import mongoose, { disconnect } from 'mongoose';
import TestAgent from 'supertest/lib/agent';
import { wait } from 'common';
import { logger } from '../src/utils/logger';
import { users } from './users';

export let appInstance: TestAgent;
describe('Test the root path', () => {
  before(async () => {
    await ready;
    appInstance = supertest(app);
    await wait(1000);
  });
  after(async () => {
    logger.info('Tearup');
    await mongoose.connection.close();
    await mongoose.disconnect();
    await disconnect();
  });

  users();
});
