import { _decorator, Button, Component, director, Label, Node, Sprite } from 'cc';
const { ccclass, property,type } = _decorator;
import { GameUILayers } from '../../scripts/GameUILayers';
import { GameEvent, GameMgr } from '../../module_basic/scripts/GameMgr';
import { ModuleDef } from '../../scripts/ModuleDef';
import { RoomMgr } from '../../module_basic/scripts/RoomMgr';

@ccclass('Layout_UIGameHUD')
export class Layout_UIGameHUD extends Component {
    @property(Label) lblRoomId:Label;
    @property(Label) lblPos:Label;
    @property(Label) lblTimer:Label;
    @property(Label) lblScore:Label;
}


@tgx_class(ModuleDef.GAME)
export class UIGameHUD extends tgx.UIController {

    public get layout():Layout_UIGameHUD{
        return this._layout as Layout_UIGameHUD;
    }

    constructor() {
        super('ui_game_hud/ui_game_hud', GameUILayers.HUD, Layout_UIGameHUD);
    }

    protected onCreated(): void {
        this.layout.lblRoomId.string = RoomMgr.inst.data.displayId;
    }

    fastFormatTimeStr(time:number){
        if(time < 0){
            time = 0;
        }
        let timeInSeconds = Math.floor(time/1000);
        let s = timeInSeconds % 60 as any;
        if(s < 10){
            s = '0' + s;
        }
        let m = Math.floor(timeInSeconds / 60) as any;
        if(m < 10){
            m = '0' + m;
        }
        return m +':' + s;
    }

    refreshTimer() {
        let layout = this._layout as Layout_UIGameHUD;
        if(GameMgr.inst.gameData && GameMgr.inst.gameData.gameState == 'playing'){
            layout.lblTimer.node.active = true;
            layout.lblTimer.string = this.fastFormatTimeStr(GameMgr.inst.gameStateEndTime - Date.now());
        }
        else{
            layout.lblTimer.node.active = false;
        }
    }

    protected onUpdate(dt: number): void {
        let selfPlayer = GameMgr.inst.selfPlayer;
        if (selfPlayer == null) return;
        //this.layout.lblPos.string = 'x:' + ~~selfPlayer.transform[0] + ', y:' + ~~selfPlayer.transform[1];
        this.refreshTimer();
        this.layout.lblScore.string = '' + selfPlayer.weight;

    }
}