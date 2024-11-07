import { Debuger } from '../debugers/Debuger';
import { TickerManager } from '../ticker/TickerManager';
import { DEvent } from './DEvent';
import { IEventDispatcher } from './IEventDispatcher';

/**
 * 事件分发器(只有一对多的情况下去使用)
 */
export class EventDispatcher implements IEventDispatcher {
  /**
   * 全局事件通道
   */
  static Global: EventDispatcher = new EventDispatcher();

  /**
   * 对象已经注册的处理器
   */
  private callerMap: Map<any, Listener[]> = new Map<any, Listener[]>();

  /**
   * 事件派发器上所监听的处理器
   */
  private keyMap: Map<string, Listener[]> = new Map<string, Listener[]>();

  /**
   * 需要派发的事件
   */
  private needEmit: Array<DEvent> = [];

  constructor() {}

  /**
   * 添加事件
   * @param key
   * @param caller
   * @param func
   * @param priority 优先级（数字越小优先级越高）
   */
  On(key: string, handler: (e: DEvent) => void, caller: any, priority = 0): void {
    let infoList: Listener[];
    const info = new Listener(key, caller, handler);
    if (this.keyMap.has(key)) {
      infoList = this.keyMap.get(key)!;
      for (const iterator of infoList) {
        if (iterator.target == caller && iterator.handler == handler) {
          Debuger.Err(Debuger.DRONGO, '重复添加同一个事件监听：' + key + ' ' + caller + ' ' + handler);
          return;
        }
      }
    } else {
      infoList = [];
      this.keyMap.set(key, infoList);
    }
    infoList.push(info);
    //按照优先级排序
    infoList.sort((a, b) => a.priority - priority);

    //处理器关联处理
    if (this.callerMap.has(caller)) {
      infoList = this.callerMap.get(caller)!;
      for (const iterator of infoList) {
        if (iterator.key == key && iterator.handler == handler) {
          Debuger.Err(Debuger.DRONGO, '事件系统 处理器关联错误：' + key + ' ' + caller + ' ' + handler);
        }
      }
    } else {
      infoList = [];
      this.callerMap.set(caller, infoList);
    }
    infoList.push(info);
  }

  /**
   * 删除事件监听
   * @param key
   * @param caller
   * @param handler
   */
  Off(key: string, handler: (e: DEvent) => void, caller: any): void {
    if (this.keyMap.has(key) == false) {
      return;
    }
    let infoList: Listener[] = this.keyMap.get(key)!;
    let info: Listener;
    let deleteInfo: Listener | null = null;
    //删除
    for (let index = 0; index < infoList.length; index++) {
      info = infoList[index];
      if (info.target == caller && info.handler == handler) {
        deleteInfo = info;
        infoList.splice(index, 1);
        break;
      }
    }
    if (this.callerMap.has(caller)) {
      infoList = this.callerMap.get(caller)!;
      //删除
      for (let index = 0; index < infoList.length; index++) {
        info = infoList[index];
        if (info.key == key && info.handler == handler) {
          deleteInfo = info;
          infoList.splice(index, 1);
          break;
        }
      }
    }
    //销毁处理器
    if (deleteInfo) {
      deleteInfo.Destroy();
    }
  }

  /**
   * 删除指定对象所有的事件处理
   * @param caller
   */
  OffByCaller(caller: any): void {
    const infoList: Listener[] | undefined = this.callerMap.get(caller);
    if (infoList === undefined || infoList.length == 0) {
      return;
    }
    let info: Listener;
    //逐个删除
    while (infoList.length) {
      info = infoList[0];
      this.Off(info.key, info.handler, info.target);
    }
    //删除空列表
    this.callerMap.delete(caller);
  }

  /**
   * 删除所有事件监听
   */
  OffAllEvent(): void {
    this.keyMap.forEach((infoList) => {
      infoList.forEach((info) => {
        info.Destroy();
      });
    });
    this.keyMap.clear();
    this.callerMap.clear();
  }

  /**
   * 派发事件
   * @param type
   * @param data
   */
  Emit(type: string, data?: any, err?: Error, progress?: number): void {
    if (!this.HasEvent(type)) {
      //没人关心这个事件
      return;
    }
    const evt = DEvent.Create(type, this, data, err, progress);
    this.needEmit.push(evt);
    TickerManager.CallNextFrame(this.__emit, this);
  }

  private __emit(): void {
    for (let index = 0; index < this.needEmit.length; index++) {
      const event = this.needEmit[index];
      //有人关心且事件没有被停止
      if (this.HasEvent(event.type) && event.propagationStopped == false) {
        const list: Listener[] = this.keyMap.get(event.type)!;
        let listener: Listener;
        for (let index = 0; index < list.length; index++) {
          listener = list[index];
          //事件是否被停止
          if (event.propagationStopped) {
            break;
          }
          listener.handler.apply(listener.target, [event]);
        }
      }
      //事件退还
      DEvent.BackToPool(event);
    }
    this.needEmit.length = 0;
  }

  /**
   * 是否有事件监听
   * @param key
   */
  HasEvent(key: string): boolean {
    return this.keyMap.has(key);
  }

  /**
   * 是否包含指定函数事件监听
   * @param key
   * @param caller
   * @param func
   */
  HasEventHandler(key: string, handler: (e: DEvent) => void, caller: any): boolean {
    if (this.keyMap.has(key) == false) {
      return false;
    }
    const infoList: Listener[] = this.keyMap.get(key)!;
    let info: Listener;
    for (let index = 0; index < infoList.length; index++) {
      info = infoList[index];
      if (info.target == caller && info.handler == handler) {
        return true;
      }
    }
    return false;
  }

  Destroy(): void {
    this.callerMap.clear();
    this.keyMap.clear();
  }
}

/**
 * 监听者
 */
class Listener {
  key = '';
  target: any | null;
  handler: (e: DEvent) => void;
  priority = 255;

  constructor(key: string, target: any, handler: (e: DEvent) => void) {
    this.key = key;
    this.target = target;
    this.handler = handler;
  }

  Destroy() {
    this.key = null;
    this.target = null;
    this.handler = null;
    this.priority = 0;
  }
}
