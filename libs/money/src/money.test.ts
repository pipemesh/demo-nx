import { test } from 'node:test';
import assert from 'node:assert/strict';
import { add, format } from './index.ts';

test('adds cents', () => assert.equal(add(150, 275), 425));
test('formats dollars', () => assert.equal(format(425), '$4.25'));
