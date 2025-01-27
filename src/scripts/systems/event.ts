import { EventEnum } from '@/core/enums/event.enum';

type EventCallback = (...args: any[]) => void | Promise<void>;

export class Event {
  public events: Map<string, Set<EventCallback>> = new Map();

  public on(event: EventEnum, listener: EventCallback): Event {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event)!.add(listener);
    return this;
  }

  public off(event: EventEnum, listener?: EventCallback): Event {
    if (listener) this.events.get(event)?.delete(listener);
    else this.events.get(event)?.delete;
    return this;
  }

  public async emit(event: EventEnum, ...args: any[]): Promise<Event> {
    const listeners = this.events.get(event);
    if (listeners) {
      for (const listener of listeners) {
        await listener(...args);
      }
    }

    return this;
  }

  public clear(): Event {
    this.events.clear();
    return this;
  }
}

export const eventMain = new Event();
export default new Event();
