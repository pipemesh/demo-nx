import { test } from 'node:test';
import assert from 'node:assert/strict';
import { reserve } from './service.ts';

test('reserve', () => assert.equal(reserve('a1', 2).body, '{"type":"stock.reserved","payload":{"sku":"a1","qty":2}}'));
