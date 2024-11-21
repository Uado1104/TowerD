import { GameControllerBase } from '../../../core/controller/gameController';

export class BattleWaveController extends GameControllerBase {
  readonly key = 'waveController';

  protected onStart(): void {}

  protected onPause(): void {}

  protected onResume(): void {}

  protected onEnd(): void {}

  protected onTick(dt: number): void {}
}
