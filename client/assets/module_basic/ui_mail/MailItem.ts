import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MailItem')
export class MailItem extends Component {
    @property(Label)
    lblTime: Label;

    @property(Label)
    lblFrom: Label;

    @property(Label)
    lblTitle: Label;

    @property(Node)
    hasRead: Node;

    @property(Node)
    currentFlag: Node;

    private _data: { mailId: string, time: number, from: string, title: string, content: string, state: string }

    public get data() {
        return this._data;
    }
    public setData(data) {
        this._data = data;

        let date = new Date(this._data.time);
        let str = '' + date.getFullYear();
        str += '-' + date.getMonth();
        str += '-' + date.getDate();
        str += ' ' + date.getHours();
        str += ':' + date.getMinutes();

        this.lblTime.string = str;
        this.lblTitle.string = this._data.title;
        this.hasRead.active = !!this._data.state;
    }

    public set selected(v: boolean) {
        this.currentFlag.active = v;
    }
}


