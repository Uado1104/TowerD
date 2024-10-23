import { _decorator, Button, Color, Component, Label, Node } from 'cc';
import { ModuleDef } from '../../scripts/ModuleDef';
import { GameUILayers } from '../../scripts/GameUILayers';
import { MsgGameOverPush } from '../../module_basic/shared/protocols/public/game/MsgGameOverPush';
import { IGameData, IGamePlayer } from '../../module_basic/shared/protocols/public/game/GameTypeDef';
import { TEAM_ID_MAP } from '../../module_basic/shared/types/TeamInfo';
import { GameWinnerPlayerItem } from './GameWinnerPlayerItem';
import { RoomMgr } from '../../module_basic/scripts/RoomMgr';
import { UIGameOver } from '../ui_game_over/UIGameOver';
import { IRoomData } from '../shared/types/RoomData';
const { ccclass, property } = _decorator;

const tempColor = new Color();

/**
 * @en Layout component is used to mount on the root node of the UI corresponding to the Prefab, and declare a series of property references for tgxUIController to call.
 * @zh Layout 组件用于挂载到UI对应的Prefab根节点，并声明一系列 property 引用，供 tgxUIController 调用。
*/
@ccclass('Layout_UIGameWinner')
export class Layout_UIGameWinner extends Component {
    @property(Label) lblCongrats: Label;
    @property([GameWinnerPlayerItem]) players: GameWinnerPlayerItem[] = [];
    @property(Label) lblTapToContinue: Label;
}


@tgx_class(ModuleDef.BASIC)
export class UIGameWinner extends tgx.UIController {
    constructor() {
        super('ui_game_winner/ui_game_winner', GameUILayers.POPUP, Layout_UIGameWinner);
        this._ingoreCloseAll = true;
    }

    public get layout(): Layout_UIGameWinner {
        return this._layout as Layout_UIGameWinner;
    }

    private _createdTime = 0;
    protected onCreated(args: { gameOver: MsgGameOverPush, gameData: IGameData, roomData: IRoomData }): void {
        this._createdTime = Date.now();
        this.onButtonEvent(this.node, () => {
            //1.5秒后，才可以关闭
            if (Date.now() - this._createdTime < 1500) {
                return;
            }

            this.node.getComponent(Button).interactable = false;

            tgx.UIMgr.inst.showUI(UIGameOver, () => {
                this.close();
            }, this, args);
        });

        let teamName = TEAM_ID_MAP[args.gameOver.winner].name;
        this.layout.lblCongrats.string = `恭喜[${teamName}]获得第1名！`;
        let teamPlayers = [];
        args.gameData.players.forEach(p => {
            if (p.teamId == args.gameOver.winner) {
                teamPlayers.push(p);
            }
        });

        teamPlayers.sort((a: IGamePlayer, b: IGamePlayer) => {
            return b.weight - a.weight;
        });

        for (let i = 0; i < this.layout.players.length; ++i) {
            let playerCom = this.layout.players[i];
            let teamPlayer = teamPlayers[i];
            if(teamPlayer){
                let user = args.roomData.userList.find(v=>v.uid == teamPlayer.uid);
                playerCom.setPlayer(teamPlayer,user);
            }
            else{
                playerCom.lblRoleName.node.active = false;
                playerCom.lblUserName.node.active = false;
            }
        }

        RoomMgr.inst.backToLobby(true);
    }

    protected onUpdate(dt: number): void {
        tempColor.set(this.layout.lblTapToContinue.color);
        let value = Math.sin(Date.now() / 50 / Math.PI);
        value = value * 0.5 + 0.5;
        tempColor.a = value * 255;
        this.layout.lblTapToContinue.color = tempColor;
    }
}