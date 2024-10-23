import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GenderIcon')
export class GenderIcon extends Component {
    @property(Node) male:Node;
    @property(Node) female:Node;

    public setGender(gneder:number){
        this.male.active = gneder == 1;
        this.female.active = gneder == 2;
    }
}

