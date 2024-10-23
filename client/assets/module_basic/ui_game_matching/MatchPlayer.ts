import { _decorator, Color, Component, Label, Node, Sprite } from 'cc';
import { IGamePlayer } from '../shared/protocols/public/game/GameTypeDef';
import { SpriteUtils } from '../scripts/SpriteUtils';
const { ccclass, property } = _decorator;

const tmpColor = new Color();

@ccclass('MatchPlayer')
export class MatchPlayer extends Component {
    @property(Label) lblName:Label;
    @property(Label) lblLocation:Label;
    @property(Sprite) sprSkinBg:Sprite;
    @property(Sprite) sprSkin:Sprite;
    @property(Node) emptySkin:Node;
    
    onLoad() {
        this.lblName.string = '';
        this.emptySkin.active = false;
    }

    setPlayer(player:IGamePlayer){
        this.lblName.string = player.roleName;
        Color.fromUint32(tmpColor, player.color | 0xff000000);
        this.sprSkinBg.color = tmpColor;
        //
        tmpColor.set(255,255,255,255);
        this.sprSkin.color = tmpColor;
        SpriteUtils.setTeamSkin(this.sprSkin, player.teamId);
        this.emptySkin.active = true;
    }
}

