import { format } from '@demo/money';
import { ok } from '@demo/http';

export function charge(cents: number) {
  return ok({ charged: format(cents) });
}
