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
  tick(dt: number): void;

  /**
   * 添加心跳
   * @param value
   */
  addTicker(value: ITicker): void;

  /**
   * 删除心跳
   * @param value
   */
  removeTicker(value: ITicker): void;

  /**
   * 下一帧回调
   * @param value
   * @param caller
   */
  callNextFrame(value: tickCallBackFunc, caller: any): void;

  /**
   * 清理下一帧回调请求(如果存在的话)
   * @param value
   * @param caller
   */
  clearNextFrame(value: tickCallBackFunc, caller: any): void;
}
