import { TickSystem } from '../ticker/TickerSystem';
import { DEvent } from './DEvent';

export type TEventHandle = (...args: any[]) => void;

export type TEventHandleParams<T> = T extends (...args: infer U) => void ? U : never;

export type TEventDefineType = Record<string, TEventHandle>;

/**
 * 监听者
 */
class Listener<TEventDef extends TEventDefineType, TEventType extends keyof TEventDef = keyof TEventDef> {
  key: TEventType;
  handler: (e: DEvent) => void;
  priority = 255;

  constructor(key: TEventType, handler: (e: DEvent) => void) {
    this.key = key;
    this.handler = handler;
  }

  destroy() {
    this.key = null;
    this.handler = null;
    this.priority = 0;
  }
}

export class EventDispatcher<
  TEventDefine extends TEventDefineType,
  TEventType extends keyof TEventDefine = keyof TEventDefine,
> {
  private readonly handlesMap: Map<TEventType, Map<TEventDefine[TEventType], Listener<TEventDefine>>> = new Map();

  on<T extends TEventType>(type: T, handle: TEventDefine[T]): void {
    let handles = this.handlesMap.get(type);
    const listener = new Listener<TEventDefine>(type, handle);
    if (!handles) {
      handles = new Map();
      this.handlesMap.set(type, handles);
    } else {
      if (handles.has(handle)) {
        console.error(`Reg for type ${type as string} error`);
        return;
      }
    }
    handles.set(handle, listener);
  }

  remove<T extends TEventType>(type: T, handle: TEventDefine[T]): void {
    const handlers = this.handlesMap.get(type);
    if (!handlers || !handlers.has(handle)) {
      console.error(`UnReg for type ${type as string} error`);
      return;
    }
    handlers.delete(handle);
  }

  private hasEvent(type: string): boolean {
    return this.handlesMap.has(type as TEventType);
  }

  has<T extends TEventType>(type: T, handle: TEventDefine[T]): boolean {
    const handlers = this.handlesMap.get(type);
    if (!handlers) {
      return false;
    }
    return handlers.has(handle);
  }

  emit<T extends TEventType>(type: T, ...params: TEventHandleParams<TEventDefine[T]>): void {
    const handles = this.handlesMap.get(type);
    if (!handles) {
      return;
    }
    const evt = DEvent.create(type as string, params);
    this.needEmit.push(evt);
    TickSystem.CallNextFrame(this.__emit, this);
  }

  /**
   * 需要派发的事件
   */
  private needEmit: DEvent[] = [];

  private __emit(): void {
    for (let index = 0; index < this.needEmit.length; index++) {
      const event = this.needEmit[index];
      //有人关心且事件没有被停止
      if (this.hasEvent(event.type) && event.propagationStopped == false) {
        const list = Array.from(this.handlesMap.get(event.type as TEventType)!.values()).sort(
          (a, b) => a.priority - b.priority,
        );
        let listener: Listener<TEventDefine>;
        for (let index = 0; index < list.length; index++) {
          listener = list[index];
          //事件是否被停止
          if (event.propagationStopped) {
            break;
          }
          listener.handler(event.data);
        }
      }
      //事件退还
      DEvent.backToPool(event);
    }
    this.needEmit.length = 0;
  }
}
