import { _decorator, Component, Node, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Layout_UIGameJoystick')
export class Layout_UIGameJoystick extends Component {
    @property([Sprite]) cdSprites:Sprite[] = [];   
}

