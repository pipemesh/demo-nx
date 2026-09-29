import { event, type Event } from '@demo/events';

export function notify(to: string): Event<{ to: string }> {
  return event('notification.sent', { to });
}
