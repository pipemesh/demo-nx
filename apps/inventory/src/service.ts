import { event } from '@demo/events';
import { ok } from '@demo/http';

export function reserve(sku: string, qty: number) {
  return ok(event('stock.reserved', { sku, qty }));
}
