import { _decorator, screen, find, Camera, RenderTexture, SpriteFrame, director, Material, renderer, Vec2, UITransform, Vec4 } from 'cc';
import { ModuleDef } from '../../scripts/ModuleDef';
import { GameUILayers } from '../../scripts/GameUILayers';
import { Layout_UIGameMask } from './Layout_UIGameMask';
import { GameEvent, GameMgr } from '../../module_basic/scripts/GameMgr';
import { IGamePlayer } from '../../module_basic/shared/protocols/public/game/GameTypeDef';
const { ccclass, property } = _decorator;


const tempV4 = new Vec4();
/**
 * @en game mask, used for war fog and death effect
 * @zh 游戏蒙板，用来处理死亡效果和战争迷雾
*/
@tgx_class(ModuleDef.GAME)
export class UIGameMask extends tgx.UIController {
    /**
     * @en used for storing scene render camera
     * @zh 保存用于场景渲染的摄像机 
     */
    private _camera: Camera;
    
    /**
     * @en render scene content to this texture, used for death effect
     * @zh 渲染场景到此纹理，用于处理死亡时的变灰效果
     */
    private _rt: RenderTexture;

    /**
     * @en used for setting shader parameters with low performance cost
     * @zh 用于在 update 函数中，高效设置 shader 参数
    */
    private _handle: number;
    private _fogOfWarTrans: UITransform;
    private _pass: renderer.Pass;

    /**
     * @en the radius of war fog, this radius is transparent, and fade out after this radius
     * @zh 战争迷雾的中心半径，此半径内为透明，超出此半径后渐变
    */
    private _fogOfWarCenterRadius = 200.0;
    /**
     * @en the range of war fog fade out
     * @zh 战雾渐变范围
    */
    private _fogOfWarFadeOutRange = 400.0;

    constructor() {
        super('ui_game_mask/ui_game_mask', GameUILayers.GAME, Layout_UIGameMask);

        director.on(GameEvent.PLAYER_DIE, this.onPlayerDie, this);
        director.on(GameEvent.PLAYER_REVIVE, this.onPlayerRevive, this);
    }

    protected onCreated(): void {
        this._camera = find('SceneRoot2D/Camera').getComponent(Camera);

        let layout = this._layout as Layout_UIGameMask;

        this._fogOfWarTrans = layout.sprFogOfWar.getComponent(UITransform);

        layout.sprGrayScreen.node.active = false;
        this._pass = layout.sprFogOfWar.customMaterial.passes[0];
        this._handle = this._pass.getHandle('fogOfWarParams');
    }

    protected onUpdate(dt: number): void {
        tempV4.set(this._fogOfWarTrans.width, this._fogOfWarTrans.height, this._fogOfWarCenterRadius, this._fogOfWarFadeOutRange);
        this._pass.setUniform(this._handle, tempV4);
    }


    protected onDispose(): void {
        director.off(GameEvent.PLAYER_DIE, this.onPlayerDie, this);
        director.off(GameEvent.PLAYER_REVIVE, this.onPlayerRevive, this);
        this.normalScreen();
        this._rt?.destroy();
    }

    grayScreen() {
        let layout = this._layout as Layout_UIGameMask;
        layout.sprGrayScreen.node.active = true;

        if (!this._rt) {
            let size = screen.windowSize;
            let dpr = screen.devicePixelRatio;
            if (dpr > 1.5) {
                dpr = 1.5;
            }
    
            let width = Math.floor(size.width * dpr);
            let height = Math.floor(size.height * dpr);
            let w2h = width / height;
            if (width > 2048) {
                width = 2048;
                height = Math.floor(width / w2h);
            }
            if (height > 2048) {
                height = 2048;
                width = Math.floor(height * w2h);
            }
    
            this._rt = new RenderTexture();
            this._rt.initialize({ width: width, height: height });
    
            let spriteFrame = new SpriteFrame();
            spriteFrame.texture = this._rt;
            layout.sprGrayScreen.spriteFrame = spriteFrame;
            layout.sprGrayScreen.grayscale = true;
        }

        this._camera.targetTexture = this._rt;
    }

    normalScreen() {
        let layout = this._layout as Layout_UIGameMask;
        layout.sprGrayScreen.node.active = false;
        this._camera.targetTexture = null;
    }


    onPlayerDie(player: IGamePlayer) {
        if (player.playerId == GameMgr.inst.selfPlayer.playerId) {
            this.grayScreen();
        }
    }

    onPlayerRevive(player: IGamePlayer) {
        if (player.playerId == GameMgr.inst.selfPlayer.playerId) {
            this.normalScreen();
        }
    }
}