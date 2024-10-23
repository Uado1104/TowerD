import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Layout_UIGameRank')
export class Layout_UIGameRank extends Component {
    @property(Node) listRoot:Node;
}

