import { TickSystem } from '../../../core/ticker/TickerSystem';
import { GameStrategy } from '../strategy/gameStrategy';
import { GameSessionController } from './sessionController';

export class GameProcessController {
  static gameSessionController = new GameSessionController();

  private static ticker = {
    Tick: GameProcessController.gameSessionController.tick,
  };

  static start() {
    GameStrategy.init();
    TickSystem.AddTicker(GameProcessController.ticker);
  }

  static stop() {
    TickSystem.RemoveTicker(GameProcessController.ticker);
    GameStrategy.destroy();
  }
}
