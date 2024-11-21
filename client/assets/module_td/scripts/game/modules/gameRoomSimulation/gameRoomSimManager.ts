import { Logger } from '../../../core/debugers/log';
import { ITicker } from '../../../core/ticker/ITicker';
import { TickSystem } from '../../../core/ticker/TickerSystem';
import { GameRoomSimModel } from './gameRoomSimModel';

export class GameRoomSimulationManager {
  static start() {
    Logger.log('GameServerSimulationManager', 'start');
    // 将玩家数据以及回合数据传入，开启tick

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
}
