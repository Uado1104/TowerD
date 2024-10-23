import { _decorator, Component, Node, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Layout_UIGameMask')
export class Layout_UIGameMask extends Component {
    @property(Sprite) sprGrayScreen:Sprite;
    @property(Sprite) sprFogOfWar:Sprite;
}

