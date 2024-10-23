import { _decorator, Component, Node } from 'cc';
import { SceneDef } from '../../scripts/SceneDef';
import { UISettings } from '../ui_settings/UISettings';
import { UINotice } from '../ui_notice/UINotice';
import { UIMail } from '../ui_mail/UIMail';
import { UIEnterRoom } from '../ui_enter_room/UIEnterRoom';
import { UIAboutQLZ } from '../ui_about_qlz/UIAboutQLZ';
const { ccclass, property } = _decorator;

@ccclass('MenuBar')
export class MenuBar extends Component {
    start() {

    }

    update(deltaTime: number) {
        
    }

    onBtnSettingsClicked(){
        tgx.UIMgr.inst.showUI(UISettings);
    }

    onBtnAboutClicked(){
        tgx.UIMgr.inst.showUI(UIAboutQLZ);
    }

    onBtnShuYuanClicked(){
        tgx.UIAlert.show("\"麒麟书院\"是一个游戏开发者社区,\n希望能够帮助开发者从入门、进阶、到变现。\n欢迎大家使用 TGX 系列框架开发项目!");
    }

    onBtnNoticeClicked(){
        tgx.UIMgr.inst.showUI(UINotice);
    }

    onBtnMailClicked(){
        tgx.UIMgr.inst.showUI(UIMail);
    }

    onBtnLuckyClicked(){

    }

    onBtnDailyClicked(){

    }

    onBtnEnterRoomClicked(){
        tgx.UIMgr.inst.showUI(UIEnterRoom);
    }

    onBtnBackClicked(){
        tgx.SceneUtil.loadScene(SceneDef.LOBBY);
    }
}


