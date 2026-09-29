export interface Event<T> {
  type: string;
  payload: T;
}

export function event<T>(type: string, payload: T): Event<T> {
  return { type, payload };
}
