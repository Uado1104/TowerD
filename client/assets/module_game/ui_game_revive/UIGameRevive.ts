import { _decorator } from 'cc';
import { ModuleDef } from '../../scripts/ModuleDef';
import { GameUILayers } from '../../scripts/GameUILayers';
import { Layout_UIGameRevive } from './Layout_UIGameRevive';
import { GameMgr } from '../../module_basic/scripts/GameMgr';

@tgx_class(ModuleDef.GAME)
export class UIGameRevive extends tgx.UIController {
    private _endTime = 0;
    constructor() {
        super('ui_game_revive/ui_game_revive', GameUILayers.POPUP, Layout_UIGameRevive);
        // + 500ms 用于延迟显示，用于消除网络延时带来的视觉误差
        // + 500ms used to delay display, to eliminate visual error caused by network latency
        this._endTime = Date.now() + GameMgr.inst.selfPlayer.reviveTime + 500;
    }

    protected onCreated(): void {
    }

    protected onUpdate(dt: number): void {
        if (GameMgr.inst.selfPlayer?.reviveTime <= 0) {
            this.close();
            return;
        }

        let layout = this._layout as Layout_UIGameRevive;
        let remainingTime = Math.ceil((this._endTime - Date.now()) / 1000);
        if (remainingTime < 0) {
            remainingTime = 0;
        }
        if (remainingTime < 60) {
            layout.lblTime.string = remainingTime + 's';
        }
        else {
            let s = remainingTime % 60;
            let m = Math.floor(remainingTime / 60);
            layout.lblTime.string = m + 'm' + s + 's';
        }
    }
}