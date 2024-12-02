import { EventHandler } from 'cc';
import { ui_test } from '../../../ui/ui_test/ui_test';
import { Logger } from '../../core/debugers/log';
import { GameProcessController } from '../gameWorld/controller/gameProcessController';
import { UIController } from './UIController';

export class UiTestController extends UIController {
  private onEnenyNumberChanged(count: number) {
    const layout = this._layout as ui_test;
    layout.updateEnemyCount(count);
  }

  protected onCreated(): void {
    const layout = this._layout as ui_test;
    this.onButtonEvent(layout.BtnKillEnemy, () => {
      Logger.log('game', 'onKillEnemy');
      // GameProcessController.killEnemy();
    });
  }
}
