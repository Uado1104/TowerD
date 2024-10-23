import { _decorator, Component, Node, Label, Sprite, director } from 'cc';
import { UserMgr } from './UserMgr';
import { RoomEvent, RoomMgr } from './RoomMgr';
import { MsgUserDataChangedPush } from '../shared/protocols/public/room/MsgUserDataChangedPush';
const { ccclass, property } = _decorator;

const aiLevelStr = ['初级', '中级', '高级'];

@ccclass('GamePlayerInfo')
export class GamePlayerInfo extends Component {
    @property(Label)
    userId: Label;

    @property(Sprite)
    icon: Sprite

    @property(Node)
    readyState: Node;

    private _defaultIcon;
    private _userId: string;
    onLoad() {
        this._defaultIcon = this.icon.spriteFrame;
    }

    protected start(): void {
        director.on(RoomEvent.USER_DATA_CHANGED, this.onUserDataChanged, this);
    }

    protected onDestroy(): void {
        director.off(RoomEvent.USER_DATA_CHANGED, this.onUserDataChanged, this);
    }

    onUserDataChanged(msg: MsgUserDataChangedPush) {
        if (msg.uid != this._userId) {
            return;
        }
        if (!msg.isOnline) {
            this.readyState.active = true;
            this.readyState.getComponent(Label).string = '离线';
        }
        else {
            this.readyState.active = (!RoomMgr.inst.isPlaying && RoomMgr.inst.getUser(this._userId).ready);
        }
    }

    setAILevel(level: number) {
        this.userId.string = '电脑-' + (aiLevelStr[level] || aiLevelStr[0]);
        this.icon.spriteFrame = this._defaultIcon;
        this.readyState.active = false;
    }

    setUserId(userId: string) {
        this._userId = userId;
        if (!userId) {
            this.userId.string = '等待加入...';
            this.icon.spriteFrame = this._defaultIcon;
            this.readyState.active = false;
            if (RoomMgr.inst.isWatcher) {
                this.readyState.active = true;
                this.readyState.getComponent(Label).string = '加入';
            }
        }
        else {
            UserMgr.inst.setUserIconAndName(userId, this.icon, this.userId);
            this.readyState.active = false;
            if (RoomMgr.inst.isOnline) {
                this.readyState.active = (!RoomMgr.inst.isPlaying && RoomMgr.inst.getUser(userId).ready);
                if (this.readyState.active) {
                    this.readyState.getComponent(Label).string = '准备';
                }
            }
        }
    }

    update(deltaTime: number) {

    }
}

