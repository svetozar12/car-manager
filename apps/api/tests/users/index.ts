import { describe, it } from 'node:test';
import { appInstance } from '../index.test';
import assert from 'node:assert/strict';

export function users() {
  describe('Dummy test', () => {
    it('It should response the GET method', () => {
      return appInstance.get('/').then((response) => {
        assert.equal(response.statusCode, 200);
      });
    });
  });
}
