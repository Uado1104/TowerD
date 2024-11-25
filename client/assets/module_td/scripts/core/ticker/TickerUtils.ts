import { Logger } from '../debugers/log';
import { ITicker } from './ITicker';
import { TickSystem } from './TickerSystem';

/** 注册一个在规定时长后会自动执行某个方法的ticker */
export function registerTimeoutTicker(callback: () => void, duration: number) {
  let time = 0;
  const ticker: ITicker = {
    Tick: (dt: number) => {
      time += dt;
      if (time >= duration) {
        TickSystem.RemoveTicker(ticker);
        callback();
      }
    },
  };
  TickSystem.AddTicker(ticker);
}
