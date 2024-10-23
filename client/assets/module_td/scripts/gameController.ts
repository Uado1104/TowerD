import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('gameController')
export class gameController extends Component {
  start() {
    console.log('gameController start');
  }

  update(deltaTime: number) {}
}
