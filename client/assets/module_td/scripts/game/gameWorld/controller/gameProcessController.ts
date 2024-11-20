import { TickSystem } from '../../../core/ticker/TickerSystem';
import { GameStrategy } from '../strategy/gameStrategy';
import { GameSessionController } from './sessionController';

export class GameProcessController {
  static gameSessionController = new GameSessionController();

  private static ticker = {
    Tick: GameProcessController.gameSessionController.tick,
  };

  static start() {
    // 初始化各种模块
    // 获取数据并设置数据

    GameStrategy.excute('getSessionConfig');
    TickSystem.AddTicker(GameProcessController.ticker);
  }

  static stop() {
    TickSystem.RemoveTicker(GameProcessController.ticker);
    GameStrategy.stop();
  }
}
