// Money is integer cents throughout.
export type Cents = number;

export function add(a: Cents, b: Cents): Cents {
  return a + b;
}

export function format(c: Cents): string {
  return `$${(c / 100).toFixed(2)}`;
}
