import { Debuger } from './Debuger';
import { IDebuger } from './IDebuger';
import { Logger } from './log';

export class DebugerImpl implements IDebuger {
  private __logs: Map<string, Array<string>> = new Map<string, Array<string>>();

  private __debuger: Map<string, boolean> = new Map<string, boolean>();

  /**
   * 设置过滤
   * @param key
   * @param isOpen
   */
  Debug(key: string, isOpen: boolean) {
    this.__debuger.set(key, isOpen);
  }

  /**
   * 获取已保存的日志
   * @param type
   * @returns
   */
  GetLogs(t?: string): Array<string> {
    const type = t ?? 'all';
    if (this.__logs.has(type)) {
      return this.__logs.get(type);
    }
    return null;
  }

  private __save(type: string, logType: string, msg: string): string {
    let list: Array<string>;
    if (!this.__logs.has(type)) {
      list = [];
      this.__logs.set(type, list);
    } else {
      list = this.__logs.get(type);
    }
    const data: string = '[' + type + ']' + logType + ':' + msg;
    if (list.length >= Debuger.MaxCount) {
      list.unshift(); //删除最顶上的那条
    }
    list.push(data);
    //保存到all
    if (!this.__logs.has('all')) {
      list = [];
      this.__logs.set('all', list);
    } else {
      list = this.__logs.get('all');
    }
    if (list.length >= Debuger.MaxCount) {
      list.unshift(); //删除最顶上的那条
    }
    list.push(data);
    return data;
  }

  Log(type: string, msg: any): void {
    const data = this.__save(type, 'Log', msg);
    const isAll = this.__debuger.has('all') ? this.__debuger.get('all') : false;
    const isOpen = this.__debuger.has(type) ? this.__debuger.get(type) : false;
    if (isAll || isOpen) {
      Logger.log('degugger', data);
    }
  }

  Err(type: string, msg: any) {
    const data = this.__save(type, 'Error', msg);
    const isAll = this.__debuger.has('all') ? this.__debuger.get('all') : false;
    const isOpen = this.__debuger.has(type) ? this.__debuger.get(type) : false;
    if (isAll || isOpen) {
      console.error(data);
    }
  }

  Warn(type: string, msg: any) {
    const data = this.__save(type, 'Warn', msg);
    const isAll = this.__debuger.has('all') ? this.__debuger.get('all') : false;
    const isOpen = this.__debuger.has(type) ? this.__debuger.get(type) : false;
    if (isAll || isOpen) {
      console.warn(data);
    }
  }

  Info(type: string, msg: any) {
    const data = this.__save(type, 'Info', msg);
    const isAll = this.__debuger.has('all') ? this.__debuger.get('all') : false;
    const isOpen = this.__debuger.has(type) ? this.__debuger.get(type) : false;
    if (isAll || isOpen) {
      console.info(data);
    }
  }
}
