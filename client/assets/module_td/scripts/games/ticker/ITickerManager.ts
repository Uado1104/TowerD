import { ITicker } from './ITicker';

export type tickCallBackFunc = () => void;

/**
 * 心跳管理器
 */
export interface ITickerManager {
  /**
   * 心跳驱动函数
   * @param dt
   */
  Tick(dt: number): void;

  /**
   * 添加心跳
   * @param value
   */
  AddTicker(value: ITicker): void;

  /**
   * 删除心跳
   * @param value
   */
  RemoveTicker(value: ITicker): void;

  /**
   * 下一帧回调
   * @param value
   * @param caller
   */
  CallNextFrame(value: tickCallBackFunc, caller: any): void;

  /**
   * 清理下一帧回调请求(如果存在的话)
   * @param value
   * @param caller
   */
  ClearNextFrame(value: tickCallBackFunc, caller: any): void;
}
