import { _decorator, Color, Component, Label, Node, Sprite, Widget } from 'cc';
import { IGamePlayer } from '../../module_basic/shared/protocols/public/game/GameTypeDef';
import { IUserData } from '../shared/types/RoomData';
import { GenderIcon } from '../scripts/GenderIcon';
import { SpriteUtils } from '../scripts/SpriteUtils';
const { ccclass, property } = _decorator;

const tempColor = new Color();

@ccclass('GameOverPlayerItem')
export class GameOverPlayerItem extends Component {
    @property(Label) lblUserName: Label;
    @property(Label) lblRoleName: Label;
    @property(Sprite) sprIcon:Sprite;
    @property(Sprite) sprSkinBg: Sprite;
    @property(Sprite) sprSkin: Sprite;
    @property(Node) emptySkin: Node;
    @property(GenderIcon) gender:GenderIcon;

    async setPlayer(player: IGamePlayer, user: IUserData) {
        this.lblRoleName.string = player.roleName;

        this.lblUserName.string = user.name;
        SpriteUtils.setUserIcon(this.sprIcon, user.visualId);

        Color.fromUint32(tempColor, player.color | 0xff000000);
        this.sprSkinBg.color = tempColor;
        SpriteUtils.setTeamSkin(this.sprSkin,player.teamId);


        this.gender.setGender(user?.gender);

        this.lblUserName.updateRenderData(true);
        this.lblUserName.node.children.forEach(v=>{
            v.getComponent(Widget).updateAlignment();
        });
    }
}

