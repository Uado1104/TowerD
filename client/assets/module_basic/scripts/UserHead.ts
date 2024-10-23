import { _decorator, Component, Label, Node, Sprite } from 'cc';
import { ModuleDef } from '../../scripts/ModuleDef';
import { UserMgr } from '../scripts/UserMgr';
import { UIUserInfo } from '../ui_user_info/UIUserInfo';
const { ccclass, property } = _decorator;

@ccclass('UserHead')
export class UserHead extends Component {
    @property(Label)
    lblUserName: Label;

    @property(Label)
    lblUserId: Label;

    @property(Sprite)
    headImg: Sprite;

    @property(Label)
    lblCoin: Label;

    start() {
        UserMgr.inst.setUserIconAndName(UserMgr.inst.uid, this.headImg, this.lblUserName, ModuleDef.BASIC);
        this.lblUserId.string = 'ID:' + UserMgr.inst.uid;
        this.lblCoin.string = '战币:' + UserMgr.inst.coin;
    }

    async onHeadImgClicked() {
        let info = await UserMgr.inst.rpc_GetUserInfo(UserMgr.inst.uid);
        tgx.UIMgr.inst.showUI(UIUserInfo, null, null, info);
    }


    update(deltaTime: number) {

    }
}


