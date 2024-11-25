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
    GameStrategyManager.strategy.event.on('onRoundStart', this.onRoundStart);
    GameStrategyManager.strategy.event.on('onRoundEnd', this.onRoundEnd.bind(this));
    GameStrategyManager.strategy.event.on('onWaveStart', this.onWaveStart.bind(this));
    GameStrategyManager.strategy.event.on('onWaveEnd', this.onWaveEnd.bind(this));
    GameStrategyManager.strategy.event.on('onDrawCard', this.onDrawCard.bind(this));
    GameStrategyManager.strategy.event.on('onEndDrawCard', this.onEndDrawCard.bind(this));

    GameStrategyManager.strategy.excute('startGame');
  }

  protected onEnd(): void {
    GameStrategyManager.strategy.event.remove('onRoundStart', this.onRoundStart.bind(this));
    GameStrategyManager.strategy.event.remove('onRoundEnd', this.onRoundEnd.bind(this));
    GameStrategyManager.strategy.event.remove('onWaveStart', this.onWaveStart.bind(this));
    GameStrategyManager.strategy.event.remove('onWaveEnd', this.onWaveEnd.bind(this));
    GameStrategyManager.strategy.event.remove('onDrawCard', this.onDrawCard.bind(this));
    GameStrategyManager.strategy.event.remove('onEndDrawCard', this.onEndDrawCard.bind(this));
  }

  private onRoundStart(round: number) {
    Logger.log('GameSessionController', `Round ${round} start`);
  }

  private onRoundEnd() {
    Logger.log('GameSessionController', `Round end`);
  }

  private onWaveStart() {
    Logger.log('GameSessionController', `Wave start`);
  }

  private onWaveEnd() {
    Logger.log('GameSessionController', `Wave end`);
  }

  private onDrawCard() {
    Logger.log('GameSessionController', `Draw card`);
  }

  private onEndDrawCard() {
    Logger.log('GameSessionController', `End draw card`);
  }
}
