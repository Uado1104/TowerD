import { TEventHandleParams } from '../../../core/events/eventSystem';
import { IGamePlayStrategyBase, TCommand, TStrategyDefine } from './commands';
import { MultiPlayerStrategy } from './multiplayerStrategy';
import { SinglePlayerStrategy } from './singlePlayerStrategy';

export class GameStrategy {
  private static myGameStrategy: IGamePlayStrategyBase | undefined;

  static get gameStrategy() {
    if (!this.myGameStrategy) {
      throw new Error('GameStrategy not initialized');
    }
    return this.myGameStrategy;
  }

  static start(isSinglePlayer = true) {
    this.myGameStrategy = isSinglePlayer ? new SinglePlayerStrategy() : new MultiPlayerStrategy();
  }

  static stop() {
    this.myGameStrategy = undefined;
  }

  static excute<T extends TCommand>(command: T, ...params: TEventHandleParams<TStrategyDefine[TCommand]>) {
    this.gameStrategy.excute(command, ...params);
  }
}
