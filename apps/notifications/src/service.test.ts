import { test } from 'node:test';
import assert from 'node:assert/strict';
import { notify } from './service.ts';

test('notify', () => assert.equal(notify('a@b.c').type, 'notification.sent'));
