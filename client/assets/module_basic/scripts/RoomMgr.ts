import { SceneDef } from "../../scripts/SceneDef";
import { UserMgr } from "./UserMgr";
import { director } from "cc";
import { MsgUserDataChangedPush } from "../shared/protocols/public/room/MsgUserDataChangedPush";
import { IUserData, IRoomData } from "../shared/types/RoomData";
import { MsgRoomDataChangedPush } from "../shared/protocols/public/room/MsgRoomDataChangedPush";
import { MsgRoomDataSyncPush } from "../shared/protocols/public/room/MsgRoomDataSyncPush";
import { MsgRoomDismissedPush } from "../shared/protocols/public/room/MsgRoomDismissedPush";
import { MsgUserComesToRoomPush } from "../shared/protocols/public/room/MsgUserComesToRoomPush";
import { MsgUserLeavesFromRoomPush } from "../shared/protocols/public/room/MsgUserLeavesFromRoomPush";
import { gameNet } from "./NetGameServer";
import { GameServerAuthParams } from "../shared/types/GameServerAuthParams";
import { MsgRoomClosed } from "../shared/protocols/public/room/MsgRoomClosed";
import { LobbyMgr } from "./LobbyMgr";

export class GameMode {
    public static SOLO: string = 'solo';
    public static AI: string = 'ai';
    public static ONLINE: string = 'online';
}

export class RoomEvent {
    /**
     * @en PN is used for notifying data changed, then the client can get the new data from the master server.
     * @zh 用于通知客户端哪些数据变动，方便从 Master 获取最新数据
     * 
    */
    public static PN: string = 'RoomEvent.PN';

    public static NEW_USER_COMES: string = 'RoomEvent.NEW_USER_IN_TABLE';
    public static WATCHER_LIST_CHANGED: string = 'RoomEvent.WATCHER_LIST_CHANGED';
    public static USER_LEAVES: string = 'RoomEvent.USER_LEAVES';
    public static USER_DATA_CHANGED: string = 'RoomEvent.USER_DATA_CHANGED';
    public static ROOM_DATA_CHANGED: string = 'RoomEvent.ROOM_DATA_CHANGED';
}

export class RoomMgr {

    private static _inst: RoomMgr;
    public static get inst(): RoomMgr {
        if (!this._inst) {
            this._inst = new RoomMgr();
        }
        return this._inst;
    }

    protected _data: IRoomData
    public get data(): IRoomData {
        return this._data;
    }

    protected _gameMode: string = GameMode.SOLO;
    public get gameMode(): string {
        return this._gameMode;
    }

    public set gameMode(v: string) {
        this._gameMode = v;
    }

    public get isOnline(): boolean {
        return this.gameMode == GameMode.ONLINE;
    }

    constructor() {
        this.initNetMsgHandlers();
    }

    public init() {

    }

    public reset() {
        console.log('--- RoomMgr.reset ---');
        this._gameMode = GameMode.SOLO;
        this._data = null;
    }

    async rpc_LeaveRoom() {
        let ret = await gameNet.callApi("room/ExitRoom", {});
        return ret;
    }


    async backToLobby(silence: boolean = false) {
        if (this.isOnline) {
            let ret = await this.rpc_LeaveRoom();
            if (ret.isSucc) {
                gameNet.disconnect(3000, 'normal');
                this.reset();
                if (!silence) {
                    tgx.UIWaiting.show('正在返回大厅');
                }
                LobbyMgr.inst.backToLobby();
            }
            else {
                tgx.UIAlert.show(ret.err.message);
            }
        }
        else {
            if (!silence) {
                tgx.UIWaiting.show('正在返回大厅');
            }
            LobbyMgr.inst.backToLobby();
        }
    }

    backToLogin() {
        tgx.UIAlert.show('网络链接断开，请重新登录').onClick(() => {
            this.reset();
            tgx.SceneUtil.loadScene(SceneDef.LOGIN);
        });
    }

    public get worldId(): string {
        if (!this._data) {
            return '';
        }
        return this._data.id;
    }

    public get isPlayer(): boolean {
        if (!this._data) {
            return false;
        }

        let user = this.getUser(UserMgr.inst.uid);
        return user ? !!user.playerId : false;
    }

    public get isPlaying(): boolean {
        if (!this._data) {
            return false;
        }

        return this._data.isPlaying;
    }

    public get isWatcher(): boolean {
        if (!this._data) {
            return false;
        }

        let user = this.getUser(UserMgr.inst.uid);
        return user ? !user.playerId : false;
    }

    public get selfUser() {
        return this.getUser(UserMgr.inst.uid);
    }

    public getUser(uid: string) {
        for (let i = 0; i < this._data.userList.length; ++i) {
            let u = this._data.userList[i];
            if (u.uid == uid) {
                return u;
            }
        }
    }

    async enterRoom(params: GameServerAuthParams) {

        let ret = await gameNet.ensureConnected();
        if (!ret.isSucc) {
            return ret;
        }

        let ret2 = await gameNet.joinRoomServer(UserMgr.inst.uid);
        if (ret2.isSucc) {
            this.gameMode = GameMode.ONLINE;
        }

        return ret2;
    }


    initNetMsgHandlers() {
        gameNet.listenMsg('room/RoomDataSyncPush', this.onNet_RoomDataSyncPush, this);
        gameNet.listenMsg('room/RoomDataChangedPush', this.onNet_RoomDataChangedPush, this);
        gameNet.listenMsg('room/UserComesToRoomPush', this.onNet_UserComesToRoomPush, this);
        gameNet.listenMsg('room/UserDataChangedPush', this.onNet_UserDataChangedPush, this);
        gameNet.listenMsg('room/UserLeavesFromRoomPush', this.onNet_UserLeavesFromRoomPush, this);
        gameNet.listenMsg('room/RoomClosed', this.onNet_RoomClosed, this);
    }

    async rpc_Ready() {
        let ret = await gameNet.callApi("room/Ready", {});
        return ret;
    }

    //==========================
    onNet_RoomDismissedPush(msg: MsgRoomDismissedPush) {

    }

    onNet_RoomDataSyncPush(msg: MsgRoomDataSyncPush) {
        this._data = msg.data;
        console.log('room data sync');
    }
    onNet_RoomDataChangedPush(msg: MsgRoomDataChangedPush) {
        if (!this._data) {
            return;
        }

        if (msg.isPlaying !== undefined) {
            this._data.isPlaying = msg.isPlaying;
        }

        if (msg.numPlayer !== undefined) {
            this._data.playerNum = msg.numPlayer;
        }

        //使用 director.getScene 发送 ROOM_DATA_CHANGED 事件
        director.emit(RoomEvent.ROOM_DATA_CHANGED, msg);
    }

    onNet_UserComesToRoomPush(msg: MsgUserComesToRoomPush) {
        if (!this._data) {
            return;
        }

        let user = this.getUser(msg.uid);
        if (!user) {
            this._data.userList.push(msg);
        }

        director.emit(RoomEvent.NEW_USER_COMES, msg);
    }

    onNet_UserDataChangedPush(msg: MsgUserDataChangedPush) {
        if (!this._data) {
            return;
        }
        let userId = msg.uid;
        let u = this.getUser(userId);
        if (!u) {
            return;
        }
        if (msg.ready !== undefined) {
            u.ready = msg.ready;
        }

        if (msg.playerId !== undefined) {
            u.playerId = msg.playerId;
        }

        if (msg.isOnline !== undefined) {
            u.isOnline = msg.isOnline;
        }

        director.emit(RoomEvent.USER_DATA_CHANGED, msg);
    }

    onNet_UserLeavesFromRoomPush(msg: MsgUserLeavesFromRoomPush) {
        if (!this._data) {
            return;
        }

        let isPlayer = false;
        for (let i = 0; i < this._data.userList.length; ++i) {
            let p = this._data.userList[i];
            if (p.uid == msg.uid) {
                this._data.userList.splice(i, 1);
                isPlayer = !!p.playerId;
                break;
            }
        }

        director.emit(RoomEvent.USER_LEAVES, { uid: msg.uid, isPlayer: isPlayer });
    }

    onNet_RoomClosed(msg: MsgRoomClosed) {
        if (!this._data || this._data.id != msg.roomId || this._data.gameType != msg.gameType) {
            return;
        }
        //tgx.UIAlert.show('房间已关闭').onClick(()=>{
        //    this.backToLobby();
        //});
    }
}

RoomMgr.inst;