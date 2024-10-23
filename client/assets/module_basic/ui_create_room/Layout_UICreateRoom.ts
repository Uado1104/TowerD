import { _decorator, Button, Component, EditBox, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Layout_UICreateRoom')
export class Layout_UICreateRoom extends Component {
    @property(Button)
    btnClose:Button;

    @property(Button)
    btnCreate:Button;

    @property(EditBox)
    edtName:EditBox;

    @property(EditBox)
    edtPassword:EditBox;
}


