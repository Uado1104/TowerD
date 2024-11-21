import { _decorator, Component, Node } from 'cc';
import { TickSystem } from './core/ticker/TickerSystem';
import { GameProcessController } from './game/gameWorld/controller/gameProcessController';
import { GameStrategyManager } from './game/gameWorld/strategy/gameStrategy';
import { GameRoomSimulationManager } from './game/modules/gameRoomSimulation/gameRoomSimManager';
const { ccclass, property } = _decorator;

@ccclass('game')
export class game extends Component {
  start() {
    // 先启动游戏房间模拟
    GameRoomSimulationManager.start();

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
}
