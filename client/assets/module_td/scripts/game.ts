import { _decorator, Component, Node } from 'cc';
import { TickSystem } from './core/ticker/TickerSystem';
import { GameProcessController } from './game/gameWorld/controller/gameProcessController';
const { ccclass, property } = _decorator;

@ccclass('game')
export class game extends Component {
  start() {
    GameProcessController.start();
  }

  update(deltaTime: number) {
    TickSystem.Tick(deltaTime);
  }

  stop() {
    GameProcessController.stop();
  }
}
