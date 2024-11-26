import { _decorator, Component, Node, Label } from 'cc';
import { Logger } from '../../scripts/core/debugers/log';
import { GameProcessController } from '../../scripts/game/gameWorld/controller/gameProcessController';
import { GameModel } from '../../scripts/game/gameWorld/model/gameModel';
const { ccclass, property } = _decorator;

@ccclass('ui_test')
export class ui_test extends Component {
  start() {
    GameModel.data.addObserver('EnemyAliveCount', this.onEnenyNumberChanged);
  }

  onClickKillEnemy() {
    Logger.log('game', 'onKillEnemy');
    GameProcessController.killEnemy();
  }

  onEnenyNumberChanged() {
    const count = GameModel.data.proxy.EnemyAliveCount;
    Logger.log('ui_test', `${count} enemies left`);
    this.node.getChildByName('enemyCount').getComponent(Label).string = count.toString();
  }
}
