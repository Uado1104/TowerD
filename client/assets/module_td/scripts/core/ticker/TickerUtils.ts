import { ITicker } from './ITicker';

/** 注册一个在规定时长后会自动执行某个方法的ticker */
function registerTimeoutTicker(callback: () => void, duration: number) {
  let time = 0;
  const ticker: ITicker = {
    Tick: (dt: number) => {
      time += dt;
      if (time >= duration) {
        callback();
        unregisterTicker(ticker);
      }
    },
  };
}
