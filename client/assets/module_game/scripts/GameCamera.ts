import { _decorator, Camera, Component, isValid, Node } from 'cc';
import { Cell } from './Cell';
import { GameMgr } from '../../module_basic/scripts/GameMgr';
const { ccclass, property } = _decorator;

const TWEEN_TIME = 500;//ms

@ccclass('GameCamera')
export class GameCamera extends Component {
    @property(Cell) target:Cell;

    private _camera:Camera;

    public get camera():Camera{
        return this._camera;
    }

    start() {
        this._camera = this.node.getComponent(Camera);
        this._originalOrthoHeight = this._camera.orthoHeight;
        this._targetHeight = this._camera.orthoHeight;
        this._startHeight = this._targetHeight;
        this._defaultRadius = GameMgr.inst.gameData? GameMgr.inst.gameData.defaultPlayerCellRadius:375;
    }

    private _originalOrthoHeight = 1.0;
    private _defaultRadius = 1.0;
    private _tweenTimeStart = 0;
    private _startHeight = 0;
    private _targetHeight = 0;

    lateUpdate(deltaTime: number) {
        if(isValid(this.target)){
            let tp = this.target.node.worldPosition;
            let sp = this.node.worldPosition;
            this.node.setWorldPosition(tp.x,tp.y,sp.z);

            let targetSize = this.target.player.radius;
            let newHeight = this._originalOrthoHeight * (1.0 + Math.sqrt((targetSize/this._defaultRadius - 1.0)) * 0.5);
            if(this._targetHeight != newHeight){
                this._targetHeight = newHeight;
                this._startHeight = this._camera.orthoHeight;
                this._tweenTimeStart = Date.now();
            }
        }

        if(this._tweenTimeStart){
            let t = (Date.now() - this._tweenTimeStart) / TWEEN_TIME;
            if(t >= 1.0){
                this._camera.orthoHeight = this._targetHeight;
                this._tweenTimeStart = 0;
            }
            else{
                this._camera.orthoHeight = this._startHeight * (1.0 - t) + this._targetHeight * t;
            }
        }
    }
}

