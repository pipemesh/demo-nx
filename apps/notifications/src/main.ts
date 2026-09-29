import { notify } from './service.ts';

console.log(JSON.stringify(notify('ops@example.com').type));
