import { _decorator, Component, Node } from 'cc';
import { TickerManager } from './core/ticker/TickerManager';
const { ccclass, property } = _decorator;

@ccclass('game')
export class game extends Component {
  start() {
    console.log('game start');
  }

  update(deltaTime: number) {
    TickerManager.Tick(deltaTime);
  }
}
