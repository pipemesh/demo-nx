import { test } from 'node:test';
import assert from 'node:assert/strict';
import { charge } from './service.ts';

test('charge', () => assert.equal(charge(999).body, '{"charged":"$9.99 USD"}'));
