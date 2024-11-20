export class DEvent {
  /**
   * 事件类型
   */
  type: string;
  /**
   * 停止派发
   */
  propagationStopped = false;
  /**
   * 事件数据
   */
  data: any;

  /**
   * 构造函数
   */
  callback: any;

  constructor(type: string, data?: any, caller?: any) {
    this.init(type, data, caller);
  }

  /**
   * 初始化
   * @param type
   * @param target
   * @param data
   * @param err
   * @param progress
   */
  init(type: string, data?: any, caller?: any): void {
    this.type = type;
    this.data = data;
    this.callback = caller;
  }

  reset(): void {
    this.propagationStopped = false;
    this.type = undefined;
    this.data = null;
  }

  //============
  //全局对象池
  //============
  private static __pool: DEvent[] = [];
  /**
   * 创建事件对象,优先从池中获取
   * @param type
   * @param target
   * @param data
   * @param err
   * @param progress
   */
  static create(type: string, data?: any, caller?: any): DEvent {
    let result: DEvent;
    if (this.__pool.length > 0) {
      result = this.__pool.pop() as DEvent;
      result.init(type, data, caller);
    } else {
      result = new DEvent(type, data, caller);
    }
    return result;
  }

  /**
   * 退还
   * @param value
   */
  static backToPool(value: DEvent): void {
    value.reset();
    if (this.__pool.indexOf(value) >= 0) {
      throw new Error('重复回收:' + value);
    }
    this.__pool.push(value);
  }
}
