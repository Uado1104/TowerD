import { _decorator, Button, Component, Label, Node } from 'cc';
import { ModuleDef } from '../../scripts/ModuleDef';
import { GameUILayers } from '../../scripts/GameUILayers';
import { UITeam } from '../../module_basic/ui_team/UITeam';
import { GameOverPlayerItem } from './GameOverPlayerItem';
import { IGameData, IGamePlayer } from '../shared/protocols/public/game/GameTypeDef';
import { UserMgr } from '../scripts/UserMgr';
import { IRoomData } from '../shared/types/RoomData';
const { ccclass, property } = _decorator;

/**
 * @en Layout component is used to mount on the root node of the UI corresponding to the Prefab, and declare a series of property references for tgxUIController to call.
 * @zh Layout 组件用于挂载到UI对应的Prefab根节点，并声明一系列 property 引用，供 tgxUIController 调用。
*/
@ccclass('Layout_UIGameOver')
export class Layout_UIGameOver extends Component {
    @property(Button) btnBack:Button;
    @property(Button) btnPlay:Button;
    @property([GameOverPlayerItem]) players:GameOverPlayerItem[] = [];
    @property(Label) lblCongrats:Label;
}

@tgx_class(ModuleDef.BASIC)
export class UIGameOver extends tgx.UIController {
    constructor(){
        super('ui_game_over/ui_game_over',GameUILayers.POPUP,Layout_UIGameOver);
    }

    public get layout():Layout_UIGameOver{
        return this._layout as Layout_UIGameOver;
    }
    
    protected onCreated(data:{gameData:IGameData,roomData:IRoomData}): void {
        this.onButtonEvent(this.layout.btnBack,()=>{
            this.close();
        });

        this.onButtonEvent(this.layout.btnPlay,()=>{
            this.layout.btnPlay.interactable = false;
            tgx.UIMgr.inst.showUI(UITeam,()=>{
                this.close();
            });
        });

        let gameData = data.gameData;
        let roomData = data.roomData;

        let teamMembers:IGamePlayer[] = [];
        let selfPlayer = gameData.players.find(v=>v.uid == UserMgr.inst.uid);

        gameData.players.forEach(p=>{
            if(p.teamId == selfPlayer.teamId){
                teamMembers.push(p);
            }
        });

        for(let i = 0; i < this.layout.players.length; ++i){
            let player = teamMembers[i];
            let playerCom = this.layout.players[i];
            if(player){
                let user = roomData.userList.find(v=>v.uid==player.uid);
                playerCom.setPlayer(teamMembers[i],user);
            }
            else{
                playerCom.lblRoleName.node.active = false;
                playerCom.lblUserName.node.active = false;
            }
        }

        let teams = [];
        for(let k in gameData.teamsWeights){
            teams.push({
                teamId:Number(k),
                score:gameData.teamsWeights[k]
            });
        }

        teams.sort((a,b)=>{
            return b.score - a.score;
        });

        let rank = 0;
        for(let i = 0; i < teams.length; ++i){
            if(teams[i].teamId == selfPlayer.teamId){
                rank = i+1;
                break;
            }
        }

        this.layout.lblCongrats.string = `你的队伍排名：第${rank}名！`
    }
}