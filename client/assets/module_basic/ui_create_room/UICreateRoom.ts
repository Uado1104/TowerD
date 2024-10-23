import { GameUILayers } from "../../scripts/GameUILayers";
import { ModuleDef } from "../../scripts/ModuleDef";
import { LobbyMgr } from "../scripts/LobbyMgr";
import { GameSceneUtil } from "../scripts/GameSceneUtil";
import { UserMgr } from "../scripts/UserMgr";
import { Layout_UICreateRoom } from "./Layout_UICreateRoom";

@tgx_class(ModuleDef.BASIC)
export class UICreateRoom extends tgx.UIController {
    constructor() {
        super('ui_create_room/ui_create_room', GameUILayers.POPUP, Layout_UICreateRoom);
    }

    protected onCreated(): void {
        let layout = this._layout as Layout_UICreateRoom;
        this.onButtonEvent(layout.btnClose, () => {
            this.close();
        });

        this.onButtonEvent(layout.btnCreate, this.onBtnCreateClicked, this);

        layout.edtName.string = this.getDefaultRoomName();
    }

    private getDefaultRoomName() {
        return UserMgr.inst.name + '的好友局';
    }

    async onBtnCreateClicked() {
        let layout = this._layout as Layout_UICreateRoom;
        if (!layout.edtName.string) {
            layout.edtName.string = this.getDefaultRoomName();
            return;
        }

        if (layout.edtName.string.length > 14) {
            tgx.UIAlert.show('名称最多 14 个汉字');
            return;
        }

        if (layout.edtPassword.string.length > 16) {
            tgx.UIAlert.show('密码最多16个字符');
            return;
        }

        tgx.UIWaiting.show();

        let ret = await LobbyMgr.inst.rpc_CreateRoom('normal', layout.edtName.string, layout.edtPassword.string);

        tgx.UIWaiting.hide();

        if (ret.isSucc) {
            let password = layout.edtPassword.string;
            if (ret.isSucc) {
                let params = ret.res.enterRoomParams;
                return await GameSceneUtil.inst.enterGame(params);
            }
            else {
                tgx.UIAlert.show('创建失败');
            }

            this.close();
        }
        else {
            tgx.UIAlert.show(ret.err.message);
        }
    }
}