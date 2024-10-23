
import { _decorator, Component, Node, EditBox, EventTouch } from 'cc';
import { SceneDef } from '../../scripts/SceneDef';
import { LobbyMgr } from './LobbyMgr';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = Index
 * DateTime = Tue Nov 29 2022 20:05:39 GMT+0800 (China Standard Time)
 * Author = mykylin
 * FileBasename = Index.ts
 * FileBasenameNoExtension = Index
 * URL = db://assets/scripts/Index.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */

const LAST_NAMES = ['赵', '李', '张', '王', '姜', '刘', '孙', '吴', '上官', '欧阳', '百里', '武', '西门', '陈', '潘', '东方', '唐'];
const GIVEN_NAMES = ['天涯', '雪梨', '天天', '盼盼', '谋谋', '子轩', '童话', '子修', '婉儿', '松韵', '邱泽', '晨晨', '阳阳', '莎莎', '小小', '舞桐'];

@ccclass('CreateRoleScene')
export class CreateRoleScene extends Component {

    @property(EditBox)
    edtName: EditBox;

    @property(Node)
    selector: Node;

    @property(Node)
    icons: Node;

    private _iconIndex = 0;

    start() {
        tgx.UIMgr.inst.closeAll();
        this._iconIndex = Math.floor(Math.random() * this.icons.children.length);
        let icon = this.icons.children[this._iconIndex];
        this.selector.setWorldPosition(icon.worldPosition);

        this.onBtnRandomName();
    }


    onBtnRandomName() {
        let lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
        let givenName = GIVEN_NAMES[Math.floor(Math.random() * GIVEN_NAMES.length)];
        this.edtName.string = lastName + givenName;
    }

    onIconSelected(event: EventTouch) {
        for (let i = 0; i < this.icons.children.length; ++i) {
            if (this.icons.children[i] == event.currentTarget) {
                this._iconIndex = i;
                let icon = this.icons.children[this._iconIndex];
                this.selector.setWorldPosition(icon.worldPosition);
            }
        }
    }

    async onBtnStart() {
        let visualId = this._iconIndex;
        let name = this.edtName.string;
        let ret = await LobbyMgr.inst.rpc_CreateRole(name, visualId);
        if (!ret.isSucc) {
            return;
        }
        //create role successfully, enter meta world
        //角色创建成功，进入大厅
        tgx.SceneUtil.loadScene(SceneDef.LOBBY);
    }
}