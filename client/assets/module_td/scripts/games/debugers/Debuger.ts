import { Injector } from '../utils/Injector';
import { DebugerImpl } from './DebugerImpl';
import { IDebuger } from './IDebuger';

export class Debuger {
  static KEY = 'drongo.Debuger';

  /**
   * 引擎
   */
  static DRONGO = 'drongo';
  /**
   * 最大保存条数
   */
  static MaxCount = 1000;
  /**
   * 设置过滤
   * @param key
   * @param isOpen
   */
  static Debug(type: string, isOpen: boolean) {
    this.impl.Debug(type, isOpen);
  }

  /**
   * 获取已保存的日志
   * @param type
   * @returns
   */
  static GetLogs(type?: string): Array<string> {
    return this.impl.GetLogs(type);
  }

  static Log(type: string, msg: any): void {
    this.impl.Log(type, msg);
  }

  static Err(type: string, msg: any) {
    this.impl.Err(type, msg);
  }

  static Warn(type: string, msg: any) {
    this.impl.Warn(type, msg);
  }

  static Info(type: string, msg: any) {
    this.impl.Info(type, msg);
  }

  private static __impl: IDebuger;
  private static get impl(): IDebuger {
    if (this.__impl == null) {
      this.__impl = Injector.GetInject(this.KEY);
    }
    if (this.__impl == null) {
      this.__impl = new DebugerImpl();
    }
    return this.__impl;
  }
}
