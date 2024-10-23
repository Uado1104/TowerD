import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Layout_UIAnnouncement')
export class Layout_UIAnnouncement extends Component {
    
    @property(Node) maskNode:Node;

    @property(Label) lblContent:Label;
}


