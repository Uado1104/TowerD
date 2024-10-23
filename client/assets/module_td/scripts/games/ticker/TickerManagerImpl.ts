import { ITicker } from './ITicker';
import { ITickerManager, tickCallBackFunc } from './ITickerManager';

export class TickerManagerImpl implements ITickerManager {
  private __tickerList: Array<ITicker> = [];

  private __nextFrameCallBacks: Array<NextFrameHandler> = [];

  Tick(dt: number): void {
    let handler: NextFrameHandler;
    while (this.__nextFrameCallBacks.length) {
      handler = this.__nextFrameCallBacks.shift()!;
      handler.callBack.apply(handler.caller);
    }
    for (let index = 0; index < this.__tickerList.length; index++) {
      const element = this.__tickerList[index];
      element.Tick(dt);
    }
  }

  AddTicker(value: ITicker): void {
    const index: number = this.__tickerList.indexOf(value);
    if (index >= 0) {
      throw new Error('Ticker 重复添加！');
    }
    this.__tickerList.push(value);
  }

  RemoveTicker(value: ITicker): void {
    const index: number = this.__tickerList.indexOf(value);
    if (index < 0) {
      throw new Error('找不到要删除的Tick！');
    }
    this.__tickerList.splice(index, 1);
  }

  CallNextFrame(value: tickCallBackFunc, caller: any): void {
    for (let index = 0; index < this.__nextFrameCallBacks.length; index++) {
      const element = this.__nextFrameCallBacks[index];
      //重复
      if (element.Equal(value, caller)) {
        return;
      }
    }
    this.__nextFrameCallBacks.push(new NextFrameHandler(value, caller));
  }

  ClearNextFrame(value: tickCallBackFunc, caller: any): void {
    for (let index = 0; index < this.__nextFrameCallBacks.length; index++) {
      const element = this.__nextFrameCallBacks[index];
      //删除
      if (element.Equal(value, caller)) {
        this.__nextFrameCallBacks.splice(index, 1);
      }
    }
  }
}

class NextFrameHandler {
  callBack: tickCallBackFunc;
  caller: any;

  constructor(callBack: tickCallBackFunc, caller: any) {
    this.callBack = callBack;
    this.caller = caller;
  }

  Equal(callBack: tickCallBackFunc, caller: any): boolean {
    if (this.caller !== caller) {
      return false;
    }
    if (this.callBack !== callBack) {
      return false;
    }
    return true;
  }
}
