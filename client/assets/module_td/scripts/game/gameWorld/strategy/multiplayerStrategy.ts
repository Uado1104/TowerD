import { TEventHandleParams } from '../../../core/events/eventSystem';
import { IGamePlayStrategyBase, TCommand } from './commands';

export class MultiPlayerStrategy extends IGamePlayStrategyBase {
  onHandleCommand(command: TCommand, ...params: TEventHandleParams<never>): void {
    throw new Error('Method not implemented.');
  }
}
