import { _decorator, Component, Node } from 'cc';
import { TickSystem } from './core/ticker/TickerManager';
import { GameWorldController } from './game/gameWorld/controller/gameController';
const { ccclass, property } = _decorator;

@ccclass('game')
export class game extends Component {
  start() {
    GameWorldController.init();
  }

  update(deltaTime: number) {
    TickSystem.Tick(deltaTime);
  }

  stop() {
    GameWorldController.clear();
  }
}
