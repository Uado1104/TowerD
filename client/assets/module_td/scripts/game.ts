import { _decorator, Component, Prefab } from 'cc';
import { TickSystem } from './core/ticker/TickerSystem';
import { GameProcessController } from './game/gameWorld/controller/gameProcessController';
import { GameStrategyManager } from './game/gameWorld/strategy/gameStrategy';
import { GameUILayerNames, GameUILayers } from '../../scripts/GameUILayers';
import { UiTestController } from '../ui/ui_test/uiTestController';
import { ModuleDef } from '../../scripts/ModuleDef';
import { SceneDef } from '../../scripts/SceneDef';
const { ccclass, property } = _decorator;

// ========== config begin =================
//the first scene after preloading completes.
const _firstScene = SceneDef.LOGIN;
const _preloadBundles = [ModuleDef.GAME];
const _preloadScenes = [];
const _defaultModule = ModuleDef.GAME;

const _preloadRes = [{ bundle: ModuleDef.GAME, url: 'ui/ui_test/test', type: 'prefab' }];

// ========= config end =====================

if (_preloadScenes.indexOf(_firstScene) == -1) {
  _preloadScenes.push(_firstScene);
}

for (let i = 0; i < _preloadScenes.length; ++i) {
  const sceneInfo = _preloadScenes[i];
  const idx = _preloadBundles.indexOf(sceneInfo.bundle);
  if (idx == -1) {
    _preloadBundles.push(sceneInfo.bundle);
  }
  _preloadRes.push({ bundle: sceneInfo.bundle, url: sceneInfo.name, type: 'scene' });
}

@ccclass('game')
export class game extends Component {
  @property(Prefab)
  uiCanvasPrefab: Prefab;

  start() {
    // 初始化各种模块
    tgx.ModuleContext.setDefaultModule(_defaultModule);
    tgx.UIMgr.inst.setup(this.uiCanvasPrefab, GameUILayers.NUM, GameUILayerNames);

    GameStrategyManager.init();

    // 开始游戏
    GameProcessController.start();
    this.showTestUI();
  }

  update(deltaTime: number) {
    TickSystem.Tick(deltaTime);
  }

  stop() {
    GameProcessController.stop();
  }

  showTestUI() {
    tgx.UIMgr.inst.showUI(UiTestController, () => {});
  }
}
