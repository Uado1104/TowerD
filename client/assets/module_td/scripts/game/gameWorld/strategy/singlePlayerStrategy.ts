import { Logger } from '../../../core/debugers/log';
import { TEventHandleParams } from '../../../core/events/eventSystem';
import { GameRoomSimulationManager } from '../../modules/gameRoomSimulation/gameRoomSimManager';
import { IGamePlayStrategyBase, TCommand } from './commands';

export class SinglePlayerStrategy extends IGamePlayStrategyBase {
  onHandleCommand(command: TCommand, ...params: TEventHandleParams<never>): void {
    Logger.log('SinglePlayerStrategy.onHandleCommand', `command: ${command}, params: ${params}`);
    switch (command) {
      case 'getSessionConfig':
        Logger.log('SinglePlayerStrategy.getSessionConfig', params);
        this.onGetSessionConfig(params);
        break;
      case 'startSession':
        Logger.log('SinglePlayerStrategy.startSession', params);
        this.onStartSession();
        break;
      default:
        Logger.warn('SinglePlayerStrategy.onHandleCommand', `unknown command ${command}`);
        break;
    }
  }

  private onGetSessionConfig(session: number) {}

  private onStartSession() {}

  constructor() {
    super();
  }

  init() {

  }
}
