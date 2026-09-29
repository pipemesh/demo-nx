import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ok } from './index.ts';

test('serializes the body', () => assert.deepEqual(ok({ a: 1 }), { status: 200, body: '{"a":1}' }));
