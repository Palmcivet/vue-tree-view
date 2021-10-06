/**
 * @name mitt
 * @description Tiny 200b functional event emitter / pubsub.
 * @repository https://github.com/developit/mitt
 */

type EventType = string | symbol;

// An event handler can take an optional event argument and should not return a value
type Handler<V = any> = (...args: Array<V>) => void;
type WildcardHandler<T, V = any> = (type: T, ...args: Array<V>) => void;

// An array of all currently registered event handlers for a type
type EventHandlerList = Array<Handler>;
type WildCardEventHandlerList<T> = Array<WildcardHandler<T>>;

// A map of event types and their corresponding event handlers.
type EventHandlerMap<T = EventType> = Map<T, EventHandlerList | WildCardEventHandlerList<T>>;

export default class EventBus<T = EventType> {
  private readonly emitter: EventHandlerMap<T>;

  constructor(all?: EventHandlerMap<T>) {
    this.emitter = all ?? new Map();
  }

  /**
   * Clear the EventHandlerMap.
   */
  protected clear(): void {
    this.emitter.clear();
  }

  /**
   * Register an event handler for the given type.
   * @param type Type of event to listen for, or `"*"` for all events
   * @param handler Function to call in response to given event
   */
  public on(type: T, handler: Handler): void {
    const handlers = this.emitter.get(type);
    const added = handlers && handlers.push(handler);
    if (!added) {
      this.emitter!.set(type, [handler]);
    }
  }

  /**
   * Remove an event handler for the given type.
   * @param type Type of event to unregister `handler` from, or `"*"`
   * @param handler Handler function to remove
   */
  public off(type: T, handler: Handler): void {
    const handlers = this.emitter.get(type);
    if (handlers) {
      handlers.splice(handlers.indexOf(handler) >>> 0, 1);
    }
  }

  /**
   * Invoke all handlers for the given type.
   * If present, `"*"` handlers are invoked after type-matched handlers.
   *
   * Note: Manually firing "*" handlers is not supported.
   *
   * @param type The event type to invoke
   * @param args Any value (object is recommended and powerful), passed to each handler
   */
  public emit<V = any>(type: T, ...args: Array<V>): void {
    ((this.emitter.get(type) || []) as EventHandlerList).slice().map((handler) => {
      handler(...args);
    });
    ((this.emitter.get("*" as unknown as T) || []) as WildCardEventHandlerList<T>).slice().map((handler) => {
      handler(type, ...args);
    });
  }
}
