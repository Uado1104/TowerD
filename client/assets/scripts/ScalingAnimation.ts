import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ScalingAnimation')
export class ScalingAnimation extends Component {
    start() {

    }

    update(deltaTime: number) {
        let scale = (Math.sin(Date.now() / 1000) * 0.5 + 0.5) * 0.5 + 1;
        this.node.setScale(scale,scale,1.0);
    }
}

