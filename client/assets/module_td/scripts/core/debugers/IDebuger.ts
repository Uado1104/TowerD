export interface IDebuger {
  /**
   * 设置过滤
   * @param key
   * @param isOpen
   */
  Debug(key: string, isOpen: boolean): void;

  /**
   * 获取已保存的日志
   * @param type
   * @returns
   */
  GetLogs(type?: string): Array<string>;

  /**
   * 日志
   * @param type
   * @param msg
   */
  Log(type: string, msg: any): void;

  /**
   * 错误
   * @param type
   * @param msg
   */
  Err(type: string, msg: any): void;

  /**
   * 警告
   * @param type
   * @param msg
   */
  Warn(type: string, msg: any): void;

  /**
   * 信息
   * @param type
   * @param msg
   */
  Info(type: string, msg: any): void;
}
