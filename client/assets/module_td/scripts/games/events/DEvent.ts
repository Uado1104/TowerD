import { IEventDispatcher } from './IEventDispatcher';

export class DEvent {
  static readonly START: string = 'START';
  static readonly PROGRESS: string = 'PROGRESS';
  static readonly COMPLETE: string = 'COMPLETE';
  static readonly ERROR: string = 'ERROR';

  static readonly SHOW: string = 'SHOW';
  static readonly HIDE: string = 'HIDE';
  static readonly ADD: string = 'ADD';
  static readonly REMOVE: string = 'REMOVE';
  static readonly UPDATE: string = 'UPDATE';
  static readonly CLEAR: string = 'CLEAR';
  static readonly STATE_CHANGED: string = 'STATE_CHANGED';
  static readonly VALUE_CHANGED: string = 'VALUE_CHANGED';
  static readonly ADD_CHILD: string = 'ADD_CHILD';
  static readonly REMOVE_CHILD: string = 'REMOVE_CHILD';
  static readonly CHILD_VALUE_CHANGED: string = 'CHILD_VALUE_CHANGED';
  //===========================
  // 实例
  //===========================
  /**
   * 事件类型
   */
  type: string;
  /**
   * 事件派发者
   */
  target: IEventDispatcher;
  /**
   * 停止派发
   */
  propagationStopped = false;
  /**
   * 错误对象
   */
  error: Error;
  /**
   * 进度
   */
  progress: number;
  /**
   * 事件数据
   */
  data: any;

  constructor(type: string, target: IEventDispatcher, data?: any, err?: Error, progress?: number) {
    this.Init(type, target, data, err, progress);
  }

  /**
   * 初始化
   * @param type
   * @param target
   * @param data
   * @param err
   * @param progress
   */
  Init(type: string, target: IEventDispatcher, data?: any, err?: Error, progress?: number): void {
    this.type = type;
    this.target = target;
    this.data = data;
    this.error = err;
    this.progress = progress;
  }

  Reset(): void {
    this.propagationStopped = false;
    this.type = undefined;
    this.target = null;
    this.error = null;
    this.progress = 0;
    this.data = null;
  }

  //============
  //全局对象池
  //============
  private static __pool: Array<DEvent> = [];

  /**
   * 创建事件对象,优先从池中获取
   * @param type
   * @param target
   * @param data
   * @param err
   * @param progress
   */
  static Create(type: string, target: IEventDispatcher, data?: any, err?: Error, progress?: number): DEvent {
    let result: DEvent;
    if (this.__pool.length > 0) {
      result = this.__pool.shift();
      result.Init(type, target, data, err, progress);
    } else {
      result = new DEvent(type, target, data, err, progress);
    }
    return result;
  }

  /**
   * 退还
   * @param value
   */
  static BackToPool(value: DEvent): void {
    value.Reset();
    if (this.__pool.indexOf(value) >= 0) {
      throw new Error('重复回收:' + value);
    }
    this.__pool.push(value);
  }
}
