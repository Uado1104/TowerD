import { UITransform, isValid } from "cc";
import { GameUILayers } from "../../scripts/GameUILayers";
import { Layout_UIAnnouncement } from "./Layout_UIAnnouncement";
import { GameSceneUtil } from "../scripts/GameSceneUtil";
import { ModuleDef } from "../../scripts/ModuleDef";
import { LobbyMgr } from "../scripts/LobbyMgr";


@tgx_class(ModuleDef.BASIC)
export class UIAnnouncement extends tgx.UIController {
    constructor() {
        super('ui_announcement/ui_announcement', GameUILayers.HUD, Layout_UIAnnouncement);
    }

    private _maskWidth = 0;
    private _contentWidth = 0;
    protected async onCreated(): Promise<void> {

        let ret = await LobbyMgr.inst.rpc_GetAnnouncement('lobby');
        if (!isValid(this.node)) {
            return;
        }

        let layout = this._layout as Layout_UIAnnouncement;
        let pos = layout.maskNode.position;
        this._maskWidth = layout.maskNode.getComponent(UITransform).width;
        layout.lblContent.node.setPosition(this._maskWidth / 2, pos.y, pos.z);

        if (ret.isSucc) {
            layout.lblContent.string = ret.res.content;
        }
        else {
            layout.lblContent.string = '获取公告失败，请联系管理员微信：TheMrKylin';
        }
        layout.lblContent.updateRenderData();
        this._contentWidth = layout.lblContent.getComponent(UITransform).width;
    }

    setPosition(x: number, y: number) {
        this.node.setPosition(x, y, 0);
    }

    protected onUpdate(dt: number): void {
        let layout = this._layout as Layout_UIAnnouncement;
        if (layout) {
            let pos = layout.lblContent.node.position;
            if (this._contentWidth && pos.x + this._contentWidth < -this._maskWidth / 2) {
                layout.lblContent.node.setPosition(this._maskWidth / 2, pos.y, pos.z);
            }
            else {
                layout.lblContent.node.setPosition(pos.x - dt * 200, pos.y, pos.z);
            }
        }
    }
}