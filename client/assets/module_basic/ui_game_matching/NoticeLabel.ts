import { _decorator, Color, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

const tmpColor = new Color();
@ccclass('NoticeLabel')
export class NoticeLabel extends Component {
    private _label:Label;

    protected onLoad(): void {
        this._label = this.getComponent(Label);
    }
    
    public get alpha(){
        return this._label.color.a;
    }

    public set string(str:string){
        this._label.string = str;
    }

    public get string(){
        return this._label.string;
    }

    public set alpha(value:number){
        tmpColor.set(this._label.color);
        tmpColor.a = value;
        this._label.color = tmpColor;
    }
}

