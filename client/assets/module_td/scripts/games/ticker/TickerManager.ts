import { TickerManagerImpl } from './TickerManagerImpl';
import { Injector } from '../utils/Injector';
import { ITicker } from './ITicker';
import { ITickerManager, tickCallBackFunc } from './ITickerManager';

/**
 * 心跳管理器
 */
export class TickerManager {
  static KEY = 'drongo.TickerManager';

  /**
   * 心跳驱动接口
   * @param dt
   */
  static Tick(dt: number): void {
    this.impl.Tick(dt);
  }
  /**
   * 添加
   * @param value
   */
  static AddTicker(value: ITicker): void {
    this.impl.AddTicker(value);
  }

  /**
   * 删除
   * @param value
   */
  static RemoveTicker(value: ITicker): void {
    this.impl.RemoveTicker(value);
  }

  /**
   * 下一帧回调
   * @param value
   */
  static CallNextFrame(value: tickCallBackFunc, caller: any): void {
    this.impl.CallNextFrame(value, caller);
  }

  /**
   * 清理回调
   * @param value
   * @param caller
   */
  static ClearNextFrame(value: tickCallBackFunc, caller: any): void {
    this.impl.ClearNextFrame(value, caller);
  }

  private static __impl: ITickerManager;
  static get impl(): ITickerManager {
    if (this.__impl == null) {
      this.__impl = Injector.GetInject(this.KEY);
    }
    if (this.__impl == null) {
      this.__impl = new TickerManagerImpl();
    }
    return this.__impl;
  }
}
