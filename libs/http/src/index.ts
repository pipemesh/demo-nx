export interface Response {
  status: number;
  body: string;
}

export function ok(body: unknown): Response {
  return { status: 200, body: JSON.stringify(body) };
}
