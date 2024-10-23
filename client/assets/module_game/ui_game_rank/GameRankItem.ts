import { _decorator, color, Color, Component, Label, Node, Sprite } from 'cc';
import { GameMgr } from '../../module_basic/scripts/GameMgr';
const { ccclass, property } = _decorator;

const TOP_RANK_COLORS = [
    new Color(0,255,0,255),
    new Color(255,255,255,255),
]

@ccclass('TankGameRankItem')
export class TankGameRankItem extends Component {
    @property(Label) lblInfo;
    @property(Sprite) sprBg;

    setInfo(rank:number,name:string,score:number,teamId:number) {
        this.lblInfo.string = `${rank}.${name} (${score})`;
        if(teamId == GameMgr.inst.selfPlayer.teamId){
            this.lblInfo.color = TOP_RANK_COLORS[0];
        }
        else{
            this.lblInfo.color = TOP_RANK_COLORS[1];
        }
    }
}

