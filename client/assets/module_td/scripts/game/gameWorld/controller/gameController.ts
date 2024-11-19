import { TickSystem } from '../../../core/ticker/TickerSystem';
import { GameSessionController } from './sessionController';

export class GameWorldController {
  static gameSessionController = new GameSessionController();

  private static ticker = {
    Tick: GameWorldController.gameSessionController.tick,
  };

  static init() {
    TickSystem.AddTicker(GameWorldController.ticker);
  }

  static clear() {
    TickSystem.RemoveTicker(GameWorldController.ticker);
  }
}
