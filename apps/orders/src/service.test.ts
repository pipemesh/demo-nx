import { test } from 'node:test';
import assert from 'node:assert/strict';
import { placeOrder } from './service.ts';

test('placeOrder', () => assert.equal(placeOrder([100, 250]).body, '{"type":"order.placed","payload":{"total":"$3.50 USD"}}'));
test('empty order is ok', () => assert.equal(placeOrder([]).status, 200));
