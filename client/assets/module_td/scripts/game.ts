import { _decorator, Component, Node } from 'cc';
import { ECSWorld } from './game/ecs/ECSWorld';
const { ccclass, property } = _decorator;

@ccclass('game')
export class game extends Component {
  private ECSWorld: ECSWorld = new ECSWorld(100);

  start() {
    console.log('game start');
  }

  update(deltaTime: number) {
    ECSWorld.Tick(deltaTime);
  }
}
