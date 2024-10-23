import { _decorator, Component, Node, Vec2, v2, Prefab, Vec3 } from 'cc';
import { EasyController, EasyControllerEvent } from './EasyController';
const { ccclass, property } = _decorator;

const tempV2 = v2();

@ccclass('tgxCharacterMovement2D')
export class CharacterMovement2D extends Component {
    @property
    moveSpeed: number = 100;

    @property
    needRotation: boolean = false;

    start() {
        EasyController.on(EasyControllerEvent.MOVEMENT, this.onMovement, this);
        EasyController.on(EasyControllerEvent.MOVEMENT_STOP, this.onMovementStop, this);
    }

    private _moveFactor: number = 0;
    private _moveDir: Vec2 = v2(1, 0);
    private _rotDegree:number = 0;
    private _realDegree:number = 0;
    private _precision:number = 1.0;

    public get moveDir(): Vec2 {
        return this._moveDir;
    }

    private _setDegree(degree:number){
        this._realDegree = degree;
        this._rotDegree = Math.floor(this._realDegree / this._precision) * this._precision;
    }

    public getRealSpeed(): number {
        return this.moveSpeed * this._moveFactor;
    }

    /**
     * @en 
     * @zh 用于计算真实的移动方向精度。默认为 1.0，网络游戏建议设置为 5.0 到 10.0 之间
    */
    public setPrecision(p:number){
        if(p < 1){
            throw Error('precision must be greater than 1');
        }
        this._precision = p;
        this._rotDegree = Math.floor(this._realDegree / this._precision) * this._precision;
    }

    /**
     * @en current moving direction, used for calculating character movement
     * @zh 当前移动方向，用于计算角色移动
    */
    public get rotDegree():number{
        return this._rotDegree;
    }

    /**
     * @en current joystick direction, usually not used for calculating movement, used for setting character appearance
     * @zh 真实的摇杆方向，通常不用于逻辑，用于设置角色表现效果
    */
    public get realDegree():number{
        return this._realDegree;
    }


    onMovement(degree: number, strengthen: number) {
        this._setDegree(degree);
        if (this.needRotation) {
            this.node.setRotationFromEuler(0, 0, this._realDegree);
        }
        let angle = this._rotDegree / 180 * Math.PI;
        this._moveDir.set(Math.cos(angle), Math.sin(angle));
        this._moveDir.normalize();
        this._moveFactor = strengthen;
    }

    onMovementStop() {
        this._moveFactor = 0;
    }

    onDestroy() {
        EasyController.off(EasyControllerEvent.MOVEMENT, this.onMovement, this);
        EasyController.off(EasyControllerEvent.MOVEMENT_STOP, this.onMovementStop, this);
    }


    update(deltaTime: number) {
        if (this._moveFactor) {
            Vec2.multiplyScalar(tempV2, this._moveDir, this.getRealSpeed() * deltaTime);
            let pos = this.node.position;
            this.node.setPosition(pos.x + tempV2.x, pos.y + tempV2.y, pos.z);
        }
    }
}