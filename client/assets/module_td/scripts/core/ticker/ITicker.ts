/**
 * 心跳接口
 */
export interface ITicker {
  /**
   * 心跳
   * @param dt    间隔时间(秒)
   */
  Tick: (dt: number) => void;
}
