import { _decorator, Component, Button, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ui_test')
export class ui_test extends Component {
  @property(Button)
  BtnKillEnemy: Button;

  onClickKillEnemy() {
    console.log('Kill enemy');
  }

  updateEnemyCount(count: number) {
    this.node.getChildByName('enemyCount').getComponent(Label).string = count.toString();
  }
}
