import { TEventHandleParams } from '../../../core/events/eventSystem';
import { GameRoomSimulationManager } from '../../modules/gameRoomSimulation/gameRoomSimManager';
import { IGamePlayStrategyBase, TCommand, TStrategyDefine } from './commands';
import { MultiPlayerStrategy } from './multiplayerStrategy';
import { SinglePlayerStrategy } from './singlePlayerStrategy';

/** 负责收发消息、与本地模拟服务通讯或者与服务器通讯 */
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

  private static onRoundStart() {}

  private static onWaveStart() {}

  private static onWaveEnd() {}

  static excute<T extends TCommand>(command: T, ...params: TEventHandleParams<TStrategyDefine[T]>) {
    this.strategy.excute(command, ...params);
  }
}
