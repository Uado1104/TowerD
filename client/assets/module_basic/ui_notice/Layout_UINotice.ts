import { _decorator, Button, Component, Label, Node, Sprite, ToggleContainer } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Layout_UINotice')
export class Layout_UINotice extends Component {
    @property(ToggleContainer)
    tabs:ToggleContainer;

    @property(Label)
    lblContent:Label;

    @property(Sprite)
    sprContent:Sprite;

    @property(Button)
    btnClose:Button;

    @property(Node)
    emptyTips:Node;
}


