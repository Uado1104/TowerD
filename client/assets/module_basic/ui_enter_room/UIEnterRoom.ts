import { GameUILayers } from "../../scripts/GameUILayers";
import { ModuleDef } from "../../scripts/ModuleDef";
import { LobbyMgr } from "../scripts/LobbyMgr";
import { Layout_UIEnterRoom } from "./Layout_UIEnterRoom";

@tgx_class(ModuleDef.BASIC)
export class UIEnterRoom extends tgx.UIController {
    constructor() {
        super('ui_enter_room/ui_enter_room', GameUILayers.POPUP, Layout_UIEnterRoom);
    }

    protected onCreated(): void {
        let layout = this._layout as Layout_UIEnterRoom;
        this.onButtonEvent(layout.btnClose, () => {
            this.close();
        });

        this.onButtonEvent(layout.btnEnter, this.onBtnCreateClicked, this);
    }

    async onBtnCreateClicked() {
        let layout = this._layout as Layout_UIEnterRoom;

        if (layout.edtId.string.length > 8) {
            tgx.UIAlert.show('ID 最多 8 个数字');
            return;
        }

        if (layout.edtPassword.string.length > 16) {
            tgx.UIAlert.show('密码最多16个字符');
            return;
        }

        tgx.UIWaiting.show();

        let roomId = layout.edtId.string;
        let password = layout.edtPassword.string;
        
        let ret = await LobbyMgr.inst.doTryEnterRoom(roomId,password);

        tgx.UIWaiting.hide();
        if(!ret.isSucc){
            tgx.UIAlert.show("进入失败");
        }
    }

    setFixedId(id:string){
        let layout = this._layout as Layout_UIEnterRoom;
        layout.edtId.string = id;
        layout.edtId.enabled = false;
    }
}