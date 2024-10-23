import { _decorator, Button, Component, isValid, Label, Node, Sprite, Widget } from 'cc';
import { ModuleDef } from '../../scripts/ModuleDef';
import { GameUILayers } from '../../scripts/GameUILayers';
import { UserMgr } from '../scripts/UserMgr';
import { LobbyMgr } from '../scripts/LobbyMgr';
import { GameSceneUtil } from '../scripts/GameSceneUtil';
import { UIGameMatching } from '../ui_game_matching/UIGameMatching';
import { UserLocalCache } from '../scripts/UserLocalCache';
const { ccclass, property } = _decorator;

/**
 * @en Layout component is used to mount on the root node of the UI corresponding to the Prefab, and declare a series of property references for tgxUIController to call.
 * @zh Layout 组件用于挂载到UI对应的Prefab根节点，并声明一系列 property 引用，供 tgxUIController 调用。
*/
@ccclass('UITeam')
export class Layout_UITeam extends Component {
    @property(Button) btnClose: Button;

    @property(Label) lblTeam: Label;

    @property(Sprite) sprIcon: Sprite;
    @property(Label) lblUserName: Label;

    @property(Label) roleName: Label;
    @property(Label) lblTips: Label;

    @property(Button) btnMatch: Button;
    @property(Button) btnRandomName: Button;
    @property([Button]) playerSlots: Button[] = [];
}


@tgx_class(ModuleDef.BASIC)
export class UITeam extends tgx.UIController {
    constructor() {
        super('ui_team/ui_team', GameUILayers.POPUP, Layout_UITeam);
    }

    public get layout(): Layout_UITeam {
        return this._layout as Layout_UITeam;
    }

    protected async onCreated(args: any) {
        this.layout.lblTeam.string = UserMgr.inst.name + '的队伍';
        await UserMgr.inst.setUserIconAndName(UserMgr.inst.uid, this.layout.sprIcon, this.layout.lblUserName, ModuleDef.BASIC);
        this.layout.lblUserName.updateRenderData(true);
        this.layout.lblUserName.node.children.forEach(v=>{
            v.getComponent(Widget).updateAlignment();
        });

        for (let i = 0; i < this.layout.playerSlots.length; ++i) {
            this.onButtonEvent(this.layout.playerSlots[i], () => {
                tgx.UIAlert.show('功能暂未开放！');
            });
        }

        this.onButtonEvent(this.layout.btnClose,async ()=>{
            //@en if matching, need to cancel before closing
            //@zh 如果正在匹配中，则需要取消匹配
            if(this.isMatching){
                let ret = await LobbyMgr.inst.rpc_QuickPlayCancel();
                if(ret.isSucc){
                    this.close();
                }
            }
            else{
                this.close();
            }
        });
        

        this.onButtonEvent(this.layout.btnRandomName,()=>{
            this.layout.roleName.string = UserMgr.inst.getRandomName(true);
        });

        this.onButtonEvent(this.layout.btnMatch,()=>{
            this._startMatchTime = Date.now();
            this.startMatch('normal');
        });

        this.layout.lblTips.node.active = false;
        this.layout.roleName.string = UserLocalCache.inst.getRoleName(UserMgr.inst.uid);
    }

    protected onUpdate(dt: number): void {
        if (this._startMatchTime > 0) {
            let elapsedTime = Math.floor((Date.now() - this._startMatchTime) / 1000);
            if (elapsedTime < 60) {
                this.layout.lblTips.string = '匹配中... ' + elapsedTime + 's';
            }
            else {
                let s = elapsedTime % 60;
                let m = Math.floor(elapsedTime / 60);
                this.layout.lblTips.string = '匹配中... ' + m + 'm' + s + 's';
            }
        }
    }

    private _startMatchTime = 0;
    private get isMatching(){
        return this._startMatchTime > 0;
    }

    async startMatch(type: string) {
        this.layout.btnMatch.node.active = false;
        this.layout.lblTips.node.active = true;
        let ret = await LobbyMgr.inst.rpc_QuickPlay(type);
        if(!isValid(this.node)){
            //@en if the node has been destroyed, it means the match has been canceled halfway
            //@zh 如果节点已被销毁，表示中途取消了匹配
            return;
        }
        if (!ret.isSucc) {
            tgx.UIAlert.show('未找到适合的对手');
            this.layout.btnMatch.node.active = true;
            this.layout.lblTips.node.active = false;
            this._startMatchTime = 0;
        }
        else {
            //@en inactive btnClose to forbidden users close this UI at the moment
            //@zh 禁用 btnClose，用户不能在此时关闭此界面
            this.layout.btnClose.node.active = false;
            
            //@en enter game and show the waiting UI.
            //@zh 进入游戏，并显示等待其他玩家界面
            let params = ret.res;
            tgx.UIMgr.inst.showUI(UIGameMatching,async (ui:UIGameMatching)=>{
                let ret = await GameSceneUtil.inst.enterGame(params, true);
                if(!ret.isSucc){
                    //@en close matching ui, and restart to match
                    //@zh 关闭面板，重新开始匹配
                    ui.close();
                    this.layout.btnClose.node.active = true;
                    this.startMatch('normal');
                }
                else{
                    this.close();
                }
            });
        }
    }
}