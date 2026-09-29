import { test } from 'node:test';
import assert from 'node:assert/strict';
import { price } from './service.ts';

test('price', () => assert.equal(price('a1', 1200).body, '{"sku":"a1","price":"$12.00"}'));
