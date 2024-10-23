import { _decorator, Button, Component, EditBox, Label, Node, Sprite, ToggleContainer } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Layout_UIUserInfo')
export class Layout_UIUserInfo extends Component {
    @property(Button)
    btnMaskBg:Button;
    
    @property(Button)
    btnClose: Button;

    @property(Sprite)
    sprHeadImg:Sprite;

    @property(Label)
    lblName: Label;

    @property(Label)
    lblId: Label;

    @property(Label)
    lblGender: Label;

    @property(Label)
    lblIntroduction: Label;

    @property(ToggleContainer)
    toggleGenderOptions: ToggleContainer;

    @property(Button)
    btnIntroductionEdit: Button;

    @property(EditBox)
    editIntroduction: EditBox;
}


