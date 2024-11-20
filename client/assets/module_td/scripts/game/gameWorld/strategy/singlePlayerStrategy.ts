import { TEventHandleParams } from '../../../core/events/eventSystem';
import { IGamePlayStrategyBase, TCommand } from './commands';

export class SinglePlayerStrategy extends IGamePlayStrategyBase {
  onHandleCommand(command: TCommand, ...params: TEventHandleParams<never>): void {
    console.log('SinglePlayerStrategy.onHandleCommand', command, params);
    switch (command) {
      case 'getSessionConfig':
        console.log('SinglePlayerStrategy.startSession', params);
        this.onGetSessionConfig(params);
        break;
      default:
        console.warn('SinglePlayerStrategy.onHandleCommand: unknown command', command, params);
        break;
    }
  }

  private onGetSessionConfig(session: number) {
    // 设置数据
    // 设置游戏状态
    // 设置关卡状态
    // 设置波次状态
    // 设置回合状态
    // 设置玩家状态
    // 设置敌人状态
    // 设置塔状态
    // 开始第一个回合
  }

  private onStartRound() {
    // 结束游戏
  }
}
