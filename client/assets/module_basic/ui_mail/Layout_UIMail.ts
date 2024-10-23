import { _decorator, Button, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Layout_UIMail')
export class Layout_UIMail extends Component {
    @property(Button)
    btnClose:Button;

    @property(Button)
    btnMarkAllAsRead:Button;

    @property(Button)
    btnDelete:Button;

    @property(Button)
    btnClearAll:Button;

    @property(Node)
    emptyTips:Node;

    @property(Node)
    mailRoot:Node;

    @property(Label)
    lblContent:Label;
}


