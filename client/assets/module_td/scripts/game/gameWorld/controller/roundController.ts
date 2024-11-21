import { GameControllerBase } from '../../../core/controller/gameController';
import { BattleWaveController } from './battleWaveController';
import { GameRecruitController } from './recruitController';

export class GameRoundController extends GameControllerBase {
  readonly key = 'roundController';

  constructor(waveController = new BattleWaveController(), recruitController = new GameRecruitController()) {
    super([recruitController, waveController]);
  }

  private get waveController(): BattleWaveController {
    return this.childControllers[1] as BattleWaveController;
  }

  private get recruitController(): GameRecruitController {
    return this.childControllers[0] as GameRecruitController;
  }

  protected onStart(): void {}

  protected onPause(): void {}

  protected onResume(): void {}

  protected onEnd(): void {}

  protected onTick(dt: number): void {}
}
