import { format } from '@demo/money';
import { ok } from '@demo/http';

export function price(sku: string, cents: number) {
  return ok({ sku, price: format(cents) });
}
