import { Logger } from '../../../core/debugers/log';
import { EventDispatcher } from '../../../core/events/eventSystem';
import { ITicker } from '../../../core/ticker/ITicker';
import { TickSystem } from '../../../core/ticker/TickerSystem';
import { genDefaultGameRoomSim } from './gameRoomSimInterface';
import { GameRoomSimModel } from './gameRoomSimModel';

const gameRoomSimulatioEventDefine = {
  startRound: () => {},
  endRound: () => {},
  startWave: () => {},
  endWave: () => {},
};

class SessionTimer {
  constructor() {}

  time: number = 0;

  startPhase() {}

  startRound() {}

  tick(dt: number) {
    // 计时器逻辑
    this.time += dt;
  }
}


export class GameRoomSimulationManager {
  static start() {
    Logger.log('GameServerSimulationManager', 'start');
    // 将玩家数据以及回合数据传入，开启tick
    GameRoomSimulationManager.model.init(genDefaultGameRoomSim());

    TickSystem.AddTicker(GameRoomSimulationManager.tick);
  }

  static stop() {
    Logger.log('GameServerSimulationManager', 'stop');
    // 停止tick
    TickSystem.RemoveTicker(GameRoomSimulationManager.tick);
    // 清理所有数据
  }

  static tick: ITicker = {
    Tick: (dt: number) => {
      // 每一帧的逻辑
    },
  };

  private static model = new GameRoomSimModel();

  static readonly event = new EventDispatcher<typeof gameRoomSimulatioEventDefine>();
}
