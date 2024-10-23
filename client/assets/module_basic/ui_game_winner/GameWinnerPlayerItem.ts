import { _decorator, Color, Component, Label, Node, Sprite, Widget } from 'cc';
import { IGamePlayer } from '../../module_basic/shared/protocols/public/game/GameTypeDef';
import { UserMgr } from '../../module_basic/scripts/UserMgr';
import { ModuleDef } from '../../scripts/ModuleDef';
import { GenderIcon } from '../scripts/GenderIcon';
import { IUserData } from '../shared/types/RoomData';
import { SpriteUtils } from '../scripts/SpriteUtils';
const { ccclass, property } = _decorator;

const tempColor = new Color();

@ccclass('GameWinnerPlayerItem')
export class GameWinnerPlayerItem extends Component {
    @property(Sprite) bg:Sprite;
    @property(Node) emptySkin:Node;
    @property(Sprite) sprSkin:Sprite;
    @property(Sprite) sprHeadIcon:Sprite;
    @property(Label) lblUserName:Label;
    @property(Label) lblRoleName:Label;
    @property(GenderIcon) gender:GenderIcon;

    async setPlayer(player:IGamePlayer,user:IUserData){

        this.lblUserName.string = user.name;
        SpriteUtils.setUserIcon(this.sprHeadIcon, user.visualId);

        this.lblRoleName.string = player.roleName;
        this.emptySkin.active = true;

        Color.fromUint32(tempColor, player.color | 0xff000000);
        this.bg.color = new Color(player.color);
        SpriteUtils.setTeamSkin(this.sprSkin, player.teamId);
        this.gender.setGender(user?.gender);

        this.lblUserName.updateRenderData(true);
        this.lblUserName.node.children.forEach(v=>{
            v.getComponent(Widget).updateAlignment();
        });
    }
}

