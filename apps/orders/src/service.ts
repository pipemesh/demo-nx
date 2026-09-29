import { add, format } from '@demo/money';
import { event } from '@demo/events';
import { ok } from '@demo/http';

export function placeOrder(items: number[]) {
  const total = items.reduce(add, 0);
  return ok(event('order.placed', { total: format(total) }));
}
