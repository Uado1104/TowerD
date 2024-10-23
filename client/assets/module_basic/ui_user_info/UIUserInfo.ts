import { EditBox, Toggle } from "cc";
import { GameUILayers } from "../../scripts/GameUILayers";
import { UserMgr } from "../scripts/UserMgr";
import { UserInfo } from "../shared/types/UserInfo";
import { Layout_UIUserInfo } from "./Layout_UIUserInfo";
import { ModuleDef } from "../../scripts/ModuleDef";
import { ConfigMgr } from "../scripts/ConfigMgr";

const genderStrArr = ['保密', '男', '女'];

@tgx_class(ModuleDef.BASIC)
export class UIUserInfo extends tgx.UIController {
    constructor() {
        super("ui_user_info/ui_user_info", GameUILayers.POPUP, Layout_UIUserInfo);
    }

    private _userInfo: UserInfo;
    private _gender: number = undefined;
    private _introduction: string = undefined;

    protected async onCreated(userInfo: UserInfo): Promise<void> {
        this._userInfo = userInfo;

        let config = await ConfigMgr.inst.getBasicConfig();
        if (!config) {
            tgx.UIAlert.show('获取匹配失败，请稍后再试');
            this.close();
            return;
        }
        let layout = this._layout as Layout_UIUserInfo;
        this.onButtonEvent(layout.btnClose, async () => {
            if (this._gender != undefined || this._introduction != undefined) {
                tgx.UIAlert.show(`是否花费${config.userInfoModifyCost}战币修改信息？`, true).onClick(async b => {
                    this.close();
                    if (b) {
                        if (UserMgr.inst.coin < config.userInfoModifyCost) {
                            tgx.UIAlert.show('金币不足，修改失败');
                            return;
                        }

                        let ret = await UserMgr.inst.rpc_ModifyUserInfo(this._gender, this._introduction);
                        if (ret.isSucc) {
                            tgx.UIAlert.show('用户信息修改成功！');
                        }
                        else {
                            tgx.UIAlert.show('用户信息修改失败！');
                        }
                    }
                });
            }
            else {
                this.close();
            }
        });

        this.onButtonEvent(layout.btnIntroductionEdit, () => {
            layout.editIntroduction.node.active = true;
            layout.editIntroduction.string = this._introduction || this._userInfo.introduction || '';
        });

        layout.editIntroduction.node.on(EditBox.EventType.EDITING_DID_ENDED, this.onEditDidEnd, this);
        this.onButtonEvent(layout.btnMaskBg, this.onEditDidEnd, this);

        this.onToggleEvent(layout.toggleGenderOptions, (v: Toggle) => {
            let index = layout.toggleGenderOptions.toggleItems.indexOf(v);
            if (index != this._userInfo.gender) {
                this._gender = index;
            }
        });

        this.initData();
    }

    onEditDidEnd() {
        let layout = this._layout as Layout_UIUserInfo;
        if (!layout.editIntroduction.node.active) {
            return;
        }
        if (this._userInfo.introduction != layout.editIntroduction.string) {
            layout.lblIntroduction.string = layout.editIntroduction.string;
            this._introduction = layout.lblIntroduction.string;
        }
        layout.editIntroduction.node.active = false;
    }

    initData() {
        if (!this.node) {
            return;
        }
        let layout = this._layout as Layout_UIUserInfo;

        let bShow = !!this._userInfo;
        layout.lblName.node.active = bShow;
        layout.lblId.node.active = bShow;
        layout.lblGender.node.active = bShow;
        layout.toggleGenderOptions.node.active = bShow;
        layout.lblIntroduction.node.active = bShow;

        if (!this._userInfo) {
            return;
        }

        UserMgr.inst.setUserIconAndName(this._userInfo.uid, layout.sprHeadImg);
        layout.lblName.string = '昵称：' + this._userInfo.name;
        layout.lblId.string = 'ID：' + this._userInfo.uid;
        layout.lblIntroduction.string = this._userInfo.introduction || '这家伙很懒，什么也没留下~';
        layout.lblGender.string = '性别：';
        let gender = this._userInfo.gender || 0;
        if (this._userInfo.uid == UserMgr.inst.uid) {
            layout.toggleGenderOptions.toggleItems[gender].isChecked = true;
        }
        else {
            layout.toggleGenderOptions.node.active = false;
            layout.btnIntroductionEdit.enabled = false;
            layout.lblGender.string = '性别：' + genderStrArr[gender];
        }
    }
}