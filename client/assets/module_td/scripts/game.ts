import { _decorator, Component, Node } from 'cc';
import { TickSystem } from './core/ticker/TickerSystem';
import { GameProcessController } from './game/gameWorld/controller/gameProcessController';
import { GameStrategyManager } from './game/gameWorld/strategy/gameStrategy';
import { Logger } from './core/debugers/log';
const { ccclass, property } = _decorator;

@ccclass('game')
export class game extends Component {
  start() {
    // 初始化各种模块
    GameStrategyManager.init();

    // 开始游戏
    GameProcessController.start();
  }

  update(deltaTime: number) {
    TickSystem.Tick(deltaTime);
  }

  stop() {
    GameProcessController.stop();
  }

  onKillEnemy() {
    Logger.log('game', 'onKillEnemy');
    GameProcessController.killEnemy();
  }
}
