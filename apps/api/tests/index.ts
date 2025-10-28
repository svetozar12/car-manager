import test, { describe, after, before } from 'node:test';
import app from '../src/app';
import supertest from 'supertest';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import TestAgent from 'supertest/lib/agent';
import { wait } from 'common';
describe('Test the root path', () => {
  let appInstance: TestAgent;
  before(async () => {
    appInstance = supertest(app);
    await wait(1000);
  });
  after(async () => {
    mongoose.connection.close();
  });

  test('It should response the GET method', () => {
    return appInstance.get('/').then((response) => {
      assert.equal(response.statusCode, 200);
    });
  });
});
