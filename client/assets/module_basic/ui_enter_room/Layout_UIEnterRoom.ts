import { _decorator, Button, Component, EditBox, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Layout_UIEnterRoom')
export class Layout_UIEnterRoom extends Component {
    @property(Button)
    btnClose:Button;

    @property(Button)
    btnEnter:Button;

    @property(EditBox)
    edtId:EditBox;

    @property(EditBox)
    edtPassword:EditBox;
}