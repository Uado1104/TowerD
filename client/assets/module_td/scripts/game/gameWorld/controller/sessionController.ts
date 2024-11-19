import { GameControllerBase } from '../../../core/controller/gameController';
import { GameRoundController } from './roundController';

export class GameSessionController extends GameControllerBase {
  constructor(childController = new GameRoundController()) {
    super(childController);
  }

  protected onStart(): void {}

  protected onPause(): void {}

  protected onResume(): void {}

  protected onEnd(): void {}

  protected onTick(dt: number): void {}
}
