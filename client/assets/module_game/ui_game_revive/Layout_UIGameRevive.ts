import { _decorator, Component, Label, Node, RenderTexture, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Layout_UIGameRevive')
export class Layout_UIGameRevive extends Component {
    @property(Label) lblTime:Label
    @property(Sprite) sprScreen:Sprite;
}

