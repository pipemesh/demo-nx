import { test } from 'node:test';
import assert from 'node:assert/strict';
import { event } from './index.ts';

test('wraps a payload', () => assert.deepEqual(event('x', 1), { type: 'x', payload: 1 }));
