import { GameControllerBase } from '../../../core/controller/gameController';
import { Logger } from '../../../core/debugers/log';
import { GameStrategyManager } from '../strategy/gameStrategy';
import { GameRoundController } from './roundController';

export class GameSessionController extends GameControllerBase {
  readonly key = 'sessionController';

  constructor(childController = new GameRoundController()) {
    super([childController]);
  }

  private get roundController(): GameRoundController {
    return this.childControllers[0] as GameRoundController;
  }

  protected onPause(): void {}

  protected onResume(): void {}

  protected onTick(dt: number): void {}

  protected onStart(): void {
    GameStrategyManager.strategy.event.on('onRoundStart', this.onRoundStart.bind(this));
    GameStrategyManager.strategy.event.on('onRoundEnd', this.onRoundEnd.bind(this));
  }

  protected onEnd(): void {
    GameStrategyManager.strategy.event.remove('onRoundStart', this.onRoundStart.bind(this));
    GameStrategyManager.strategy.event.remove('onRoundEnd', this.onRoundEnd.bind(this));
  }

  private onRoundStart(round: number) {
    Logger.log('GameSessionController', `Round ${round} start`);
    this.roundController.start();
  }

  private onRoundEnd() {
    Logger.log('GameSessionController', `Round end`);
    this.roundController.end();
  }
}
