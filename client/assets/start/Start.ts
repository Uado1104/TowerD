import { _decorator, assetManager, Component, director, game, Label, Prefab, Node, profiler, Color } from 'cc';
import { GameUILayers, GameUILayerNames } from '../scripts/GameUILayers';

import { ModuleDef } from '../scripts/ModuleDef';
import { SceneDef } from '../scripts/SceneDef';

import { PREVIEW } from 'cc/env';

const tempColor = new Color();

const { ccclass, property } = _decorator;

// ========== config begin =================
//the first scene after preloading completes.
const _FPS = 61;
const _defaultModule = ModuleDef.BASIC;
const _firstScene = SceneDef.LOGIN;
const _preloadBundles = [ModuleDef.BASIC];
const _preloadScenes = [];

const _preloadRes = [
    { bundle: ModuleDef.BASIC, url: 'ui_alert/UI_Alert', type: 'prefab' },
    { bundle: ModuleDef.BASIC, url: 'ui_waiting/UI_Waiting', type: 'prefab' },
    { bundle: ModuleDef.BASIC, url: 'ui_login/ui_login', type: 'prefab' },
];

// ========= config end =====================

if (_preloadScenes.indexOf(_firstScene) == -1) {
    _preloadScenes.push(_firstScene);
}

for (let i = 0; i < _preloadScenes.length; ++i) {
    let sceneInfo = _preloadScenes[i];
    let idx = _preloadBundles.indexOf(sceneInfo.bundle);
    if (idx == -1) {
        _preloadBundles.push(sceneInfo.bundle);
    }
    _preloadRes.push({ bundle: sceneInfo.bundle, url: sceneInfo.name, type: 'scene' });
}

const _loadingText = ['Loading.', 'Loading..', 'Loading...'];
const _totalNum = _preloadBundles.length + _preloadRes.length;

@ccclass('Start')
export class Start extends Component {
    @property(Label)
    txtLoading: Label;

    @property(Prefab)
    uiCanvasPrefab: Prefab;

    @property(Node)
    loadingBar: Node;

    @property(Label) lblTapToContinue:Label;

    private _percent: string = '';
    private _numCurrentLoaded = 0;
    start() {
        /**
         * @en display stats in preview mode
         * @zh 预览调试时，默认显示性能统计面板
        */
        if(PREVIEW){
            profiler.showStats();
        }
        tgx.ModuleContext.setDefaultModule(_defaultModule);

        this.lblTapToContinue.node.active = false;

        game.frameRate = _FPS;
        tgx.UIMgr.inst.setup(this.uiCanvasPrefab, GameUILayers.NUM, GameUILayerNames);

        this.preloadBundle(0);
    }

    onResLoaded() {
        this._numCurrentLoaded++;
        this._percent = ~~(this._numCurrentLoaded / _totalNum * 100) + '%';
    }

    preloadBundle(idx: number) {
        assetManager.loadBundle(_preloadBundles[idx], null, (err, bundle) => {
            console.log('module:<' + _preloadBundles[idx] + '>loaded.');
            idx++;
            this.onResLoaded();
            if (idx < _preloadBundles.length) {
                this.preloadBundle(idx);
            }
            else {
                this.preloadRes(0);
            }
        });
    }

    preloadRes(idx: number) {
        let res = _preloadRes[idx];
        let bundle = assetManager.getBundle(res.bundle);

        let onComplete = () => {
            idx++;
            this.onResLoaded();
            if (idx < _preloadRes.length) {
                this.preloadRes(idx);
            }
            else {
                this.onPreloadingComplete();
            }
        }
        if (bundle) {
            if (res.type == 'prefab') {
                bundle.preload(res.url, Prefab, onComplete);
            }
            else if (res.type == 'scene') {
                bundle.preloadScene(res.url, onComplete);
            }
        }
    }

    private _isPreloadingComplete = false;
    onPreloadingComplete() {
        this._isPreloadingComplete = true;
        this.lblTapToContinue.node.active = true;
        this.loadingBar.parent.active = false;
    }

    onBtnBgClicked(){
        if(!this._isPreloadingComplete){
            return;
        }
        director.loadScene(_firstScene.name);
    }

    update(deltaTime: number) {
        if(this.loadingBar.parent.active){
            if (this._percent) {
                this.txtLoading.string = 'Loading...' + this._percent;
            }
            else {
                let idx = Math.floor(game.totalTime / 1000) % 3;
                this.txtLoading.string = _loadingText[idx];
            }
            this.loadingBar.setScale(this._numCurrentLoaded / _totalNum, 1, 1);
        }
        if(this.lblTapToContinue.node.active){
            tempColor.set(this.lblTapToContinue.color);
            let value = Math.sin(Date.now() / 50 / Math.PI);
            value = value * 0.5 + 0.5;
            tempColor.a = value * 255;
            this.lblTapToContinue.color = tempColor;
        }
    }
}


