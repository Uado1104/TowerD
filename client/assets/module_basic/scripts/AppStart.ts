import { _decorator, Component, Node, game } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AppStart')
export class AppStart extends Component {
    start() {
        game.frameRate = 28 + Math.floor(Math.random() * 30);
    }
}

