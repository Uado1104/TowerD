import { GameUILayers } from '../../../scripts/GameUILayers';
import { ModuleDef } from '../../../scripts/ModuleDef';
import { Logger } from '../../scripts/core/debugers/log';
import { GameProcessController } from '../../scripts/game/gameWorld/controller/gameProcessController';
import { GameModel } from '../../scripts/game/gameWorld/model/gameModel';
import { ui_test } from './ui_test';

@tgx_class(ModuleDef.GAME)
export class UiTestController extends tgx.UIController {
  constructor() {
    super('ui/ui_test/test', GameUILayers.POPUP, ui_test);
    GameModel.data.addObserver('EnemyAliveCount', this.onEnenyNumberChanged);
  }

  private onEnenyNumberChanged(count: number) {
    const layout = this._layout as ui_test;
    layout.updateEnemyCount(count);
  }

  protected onCreated(): void {
    const layout = this._layout as ui_test;
    this.onButtonEvent(layout.btnKillEneny, () => {
      Logger.log('game', 'onKillEnemy');
      GameProcessController.killEnemy();
    });
  }
}
