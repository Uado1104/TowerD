import { TEventHandleParams } from '../../../core/events/eventSystem';
import { IGamePlayStrategyBase, TCommand, TStrategyDefine } from './commands';
import { MultiPlayerStrategy } from './multiplayerStrategy';
import { SinglePlayerStrategy } from './singlePlayerStrategy';

export class GameStrategyManager {
  private static myGameStrategy: IGamePlayStrategyBase | undefined;

  static get strategy() {
    if (!this.myGameStrategy) {
      throw new Error('GameStrategy not initialized');
    }
    return this.myGameStrategy;
  }

  static init(isSinglePlayer = true) {
    this.myGameStrategy = isSinglePlayer ? new SinglePlayerStrategy() : new MultiPlayerStrategy();
  }

  static destroy() {
    this.myGameStrategy = undefined;
  }

  static excute<T extends TCommand>(command: T, ...params: TEventHandleParams<TStrategyDefine[T]>) {
    this.strategy.excute(command, ...params);
  }
}
