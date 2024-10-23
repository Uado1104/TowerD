import { _decorator, Button, Component, Node, Slider, Toggle } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Layout_UISettings')
export class Layout_UISettings extends Component {
    @property(Button)
    btnClose:Button;

    @property(Slider)
    sliderMusic:Slider;

    @property(Slider)
    sliderSound:Slider;

    @property(Toggle)
    chkFPS:Toggle;
}


