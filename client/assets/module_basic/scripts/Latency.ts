import { _decorator, Color, Component, Label, Node, UIRenderer } from 'cc';
import { gameNet } from './NetGameServer';
const { ccclass, property } = _decorator;

const COLORS = [
    new Color(0,255,0),
    new Color(255,255,0),
    new Color(255,0,0),
]

@ccclass('Latency')
export class Latency extends Component {
    @property(Label) lblLatency:Label;

    start() {

    }

    private _lastLatency = -1;
    update(deltaTime: number) {
        if(this._lastLatency != gameNet.latency){
            this._lastLatency = gameNet.latency;
            this.lblLatency.string = `${this._lastLatency}ms`;
            let colorIndex = 0;
            if(this._lastLatency <= 200){
                colorIndex = 0;
            }
            else if(this._lastLatency <= 500){
                colorIndex = 1;
            }
            else{
                colorIndex = 2;
            }
            
            let color = COLORS[colorIndex];
            this.node.children.forEach(child => {
                let uirenerer = child.getComponent(UIRenderer);
                uirenerer.color = color;
            });
        }
    }
}

