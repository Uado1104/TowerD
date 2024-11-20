import { GameControllerBase } from '../../../core/controller/gameController';
import { GameWaveController } from './waveController';

export class GameRoundController extends GameControllerBase {
  readonly key = 'roundController';

  constructor(childController = new GameWaveController()) {
    super([childController]);
  }

  protected onStart(): void {}

  protected onPause(): void {}

  protected onResume(): void {}

  protected onEnd(): void {}

  protected onTick(dt: number): void {}
}
