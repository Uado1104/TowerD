import { _decorator, assetManager, AssetManager, Component, Node, Prefab, Sprite, SpriteFrame } from 'cc';
import { ModuleDef } from '../../scripts/ModuleDef';
const { ccclass, property } = _decorator;

@ccclass('GameResMgr')
export class GameResMgr extends Component {
    private static _inst: GameResMgr = null;
    public static get inst(): GameResMgr { return this._inst; }
    protected onLoad(): void {
        GameResMgr._inst = this;
    }

    protected onDestroy(): void {
        GameResMgr._inst = null;
    }

    @property(Prefab) cellPrefab: Prefab;
    @property(Prefab) bulletPrefab: Prefab;

    @property([SpriteFrame]) foodSprites: SpriteFrame[] = [];
}

