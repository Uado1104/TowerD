import { _decorator, Component, Node, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SkyboxRotating')
export class SkyboxRotating extends Component {
    @property
    rotationSpeed = 0.01;
    start() {
        
    }

    update(deltaTime: number) {
        let skybox:any = director.getScene().globals.skybox;
        let angle = skybox._resource.getRotationAngle() + deltaTime * this.rotationSpeed;
        skybox._resource.setRotationAngle(angle);
    }
}

