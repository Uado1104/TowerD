import { _decorator, Component, Prefab } from 'cc';
import { TickSystem } from './core/ticker/TickerSystem';
import { GameProcessController } from './game/gameWorld/controller/gameProcessController';
import { GameStrategyManager } from './game/gameWorld/strategy/gameStrategy';
import { UIMgr } from './game/ui/uiMgr';
import { EGameUILayers } from './game/ui/uiDefine';
const { ccclass, property } = _decorator;

@ccclass('game')
export class game extends Component {
  @property(Prefab)
  uiCanvasPrefab: Prefab;

  async start() {
    // 初始化各种模块
    UIMgr.instance.init(this.uiCanvasPrefab, EGameUILayers.NUM);
    GameStrategyManager.init();

    // 开始游戏
    GameProcessController.start();
    await this.showTestUI();
  }

  update(deltaTime: number) {
    TickSystem.Tick(deltaTime);
  }

  stop() {
    GameProcessController.stop();
  }

  private async showTestUI() {
    await UIMgr.instance.showUI('test');
  }
}
