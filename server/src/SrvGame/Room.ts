import { ApiCall, BaseConnection, PrefixLogger } from "tsrpc";
import { ServiceType } from "../shared/protocols/serviceProto_public";
import { IUserData, IRoomData } from "../shared/types/RoomData";
import { gameSrv } from "./GameSrv";
import { ReqReady, ResReady } from "../shared/protocols/public/room/PtlReady";
import { GameClientConn } from "../common/WebsocketGameServer";
import { MasterSrvRPC } from "../SrvMaster/MasterSrvRPC";
import { IRoomFullState } from "../privateProtocols/game/RoomStateDef";
import { UserInfo } from "../shared/types/UserInfo";
import { ServerGlobals } from "../common/ServerGloabls";

export interface GameUserData extends IUserData {
    isAI?: boolean,
}

/**
 * @en each room stands for a battle level/table or a game room
 * @zh 每一个 Room 表示一个战斗关卡，一张球桌或者一个游戏房间
 */
export class Room {
    /**
     * @en for console debugging
     * @zh 用于控制台输出
    */
    logger: PrefixLogger;

    /***
     * @en common properties for all rooms.
     * note, these properties are often used to sync to clients.
     * the specific room may add new properties on needs.
     * @zh 所有子世界通用的属性，注意，这些属性一般会用于同步给客户端
     * 具体的子世界有可能会根据需求新增。
     */
    protected _roomData: IRoomData = {
        id: '',
        gameType: '',
        displayId: '',
        name: '',
        maxUser: 0,
        messages: [],
        userList: [],
        maxPlayerNum: 0,
        playerNum: 0,
        isPlaying: false,
    };

    private _password: string | undefined;

    /**
     * @en key:uid, value:userdata
     * @zh 方便使用 uid 查询用户数据
     **/
    protected _userMap: Map<string, GameUserData> = new Map<string, GameUserData>();

    /**
     * @en user connections in this room
     * @zh 这个房间的用户链接
     */
    conns: GameClientConn[] = [];

    /**
     * @en undefined means this room is not empty. use for closing empty rooms.
     * @zh 上一次空房的时间（undefined 代表房内有人）,用于定时解散无人的房间
     */
    lastEmptyTime?: number;

    /**
     * @en undefined means not in match queue.
     * @zh 开始匹配的时间，`undefined` 代表不在匹配中
     */
    startMatchTime?: number;

    /** 
     * @en the last update time of this room's data.
     * @zh 这个房间信息的最后更新时间 
     * */
    lastUpdateTime: number;

    protected _stateDirty = false;

    constructor(id: string, gameType: string, displayId: string, name: string, password?: string | undefined) {
        this._roomData.id = id;
        this._roomData.gameType = gameType;
        this._roomData.displayId = displayId;
        this._roomData.name = name;
        this._password = password;
        this.lastEmptyTime = undefined;
        this.startMatchTime = undefined;
        this.lastUpdateTime = Date.now();
        this.logger = new PrefixLogger({
            logger: gameSrv.websocketServer!.logger,
            prefixs: [`[Room ${id}]`],
        });
    }

    protected get roomData() {
        return this._roomData;
    }

    get id(): string {
        return this._roomData.id;
    }

    get gameType(): string {
        return this._roomData.gameType;
    }

    get maxUser(): number {
        return this._roomData.maxUser;
    }

    get messages() {
        return this._roomData.messages;
    }

    protected setPlaying(v: boolean) {
        this._roomData.isPlaying = v;
        this._stateDirty = true;
    }

    /**
     * @en current state of this room, sync to master server
     * @zh 子世界的当前状态，用于同步给 master 服务器
    */
    get state(): IRoomFullState {
        return {
            id: this._roomData.id,
            displayId: this._roomData.displayId,
            gameType: this.roomData.gameType,
            name: this._roomData.name,
            userNum: this.conns.length,
            maxUserNum: this._roomData.maxUser,
            isPlaying: this._roomData.isPlaying,
            playerNum: this._roomData.playerNum,
            maxPlayerNum: this._roomData.maxPlayerNum,
            startMatchTime: this.startMatchTime,
            updateTime: this.lastUpdateTime,
            password: this._password
        }
    }

    /**
     * @en current user num
     * @zh 当前用户数量
    */
    get userNum(): number {
        return this._roomData.userList.length;
    }

    /**
     * @en broadcast message to all connections of this room
     * @zh 在房间内广播 
     */
    broadcastMsg<T extends keyof ServiceType['msg']>(msgName: T, msg: ServiceType['msg'][T]) {
        return gameSrv.websocketServer!.server.broadcastMsg(msgName, msg, this.conns);
    }

    /**
     * @en listen messages from clients,should be overrded by sub class.
     * @zh 监听来自客户端的消息，子类会重写
     */
    listenMsgs(conn: GameClientConn) {
    }

    /**
 * @en unlisten message handlers,should be overrded by sub class.
 * @zh 取消监听，子类会重写
 */
    unlistenMsgs(conn: GameClientConn) {
    }

    /**
     * @en return whether the given uid refer to a player
     * @zh 返回 uid 对应的是否为玩家 
     */
    isPlayer(uid: string) {
        let user = this._userMap.get(uid);
        if (!user) {
            return false;
        }

        return !!user.playerId;
    }

    /**
     * @en return whether the given uid refer to a watcher
     * @zh 返回 uid 对应的是否为观众
     */
    isWatcher(uid: string) {
        let user = this._userMap.get(uid);
        if (!user) {
            return false;
        }

        return !user.playerId;
    }

    setReady(user: IUserData, value: boolean) {
        if (user.ready == true) {
            return;
        }
        user.ready = value;
        this.broadcastMsg("room/UserDataChangedPush", { uid: user.uid, ready: value });
        this.onCheckGameBegin();
    }

    onUserEnter(conn?: GameClientConn) { }

    onPlayerLeave(conn: GameClientConn) { }

    onJoinGame(newPlayer: GameUserData, roleName: string, isAI: boolean = false) { return 0; }

    onCheckGameBegin() { }

    onDisconnected(conn: GameClientConn) {
        const uid = conn.uid;
        if (!uid) {
            return;
        }
        let user = this._userMap.get(uid);
        if (user) {
            user.isOnline = false;
            this.broadcastMsg("room/UserDataChangedPush", { uid: uid, isOnline: user.isOnline });
        }
    }

    update(delTime: number) {
        if (this.lastEmptyTime && (Date.now() - this.lastEmptyTime >= 10000)) {
            this.destroy();
        }
        else {
            this.onUpdate(delTime);
        }

        if (this._stateDirty) {
            gameSrv.roomChanged({
                id: this.id,
                userNum: this.userNum,
                playerNum: this._roomData.playerNum,
                isPlaying: this._roomData.isPlaying,
            });
            this._stateDirty = false;
        }
    }

    destroy() {
        this.logger.log('[Destroy]');
        this.broadcastMsg("room/RoomClosed", { roomId: this._roomData.id, gameType: this.roomData.gameType });
        this.conns.forEach(v => {
            v.close('room_closed');
        });
        this.conns.length = 0;
        gameSrv.roomDeleted(this.id);
    }

    // ================= called by network ================
    /***
     * @en called by rpc when a user wants to take a seat and be a player.
     * @zh 当用户想要占一个位置，成为玩家时，会被 rpc 调用
     */
    onRPC_JoinGame(uid: string, roleName: string): string | undefined {
        let user = this._userMap.get(uid);
        if (!user) {
            return 'INVALID_USER_DATA';
        }

        if (!user.playerId) {
            if (this._roomData.isPlaying) {
                return 'GAME_IS_PLAYING';
            }

            if (this._roomData.playerNum == this._roomData.maxPlayerNum) {
                return 'NO_EMPTY_SEAT';
            }

            let playerId = this.onJoinGame(user, roleName);
            if (playerId) {
                user.playerId = playerId;
                this.broadcastMsg("room/UserDataChangedPush", { uid: uid, playerId: playerId });
                this.broadcastMsg("room/RoomDataChangedPush", { numPlayer: this._roomData.playerNum, isPlaying: this._roomData.isPlaying });
            }
        }
    }

    onRPC_UserReady(call: ApiCall<ReqReady, ResReady>) {
        const conn = call.conn as GameClientConn;

        let uid = conn.uid;

        if (!uid) {
            return call.error('INVALID_USER');
        }

        let user = this._userMap.get(uid);
        if (!user) {
            return call.error('INVALID_USER_DATA');
        }

        let value = true;
        this.setReady(user, value);
        call.succ({});
    }

    async onRPC_Enter(conn: GameClientConn,userInfo:UserInfo) {
        this.lastEmptyTime = 0;

        const uid = conn.uid;
        if (!uid) {
            return;
        }

        this.logger.log('[UserEnter]', uid);

        let user = this._userMap.get(uid);
        if (!user) {
            user = {
                uid: userInfo.uid!,
                name: userInfo.name!,
                visualId: userInfo.visualId!,
                gender: userInfo.gender!,
                isOnline: true,
            }
            this._roomData.userList.push(user);
            this._userMap.set(uid, user);
        }
        else {
            user.isOnline = true;
        }

        this.broadcastMsg("room/UserComesToRoomPush", user);
        conn.sendMsg("room/RoomDataSyncPush", { data: this._roomData });
        this.onUserEnter(conn);

        this._stateDirty = true;
    }

    enterAI(aiUser: GameUserData, roleName: string) {
        if (this._userMap.has(aiUser.uid)) {
            return false;
        }
        this._userMap.set(aiUser.uid, aiUser);
        this._roomData.userList.push(aiUser);
        this.broadcastMsg("room/UserComesToRoomPush", aiUser);
        this.onUserEnter();
        this.onRPC_JoinGame(aiUser.uid, roleName);
        this._stateDirty = true;
        return true;
    }

    async onRPC_Leave(conn: GameClientConn) {
        const uid = conn.uid;
        if (!uid) {
            return;
        }
        this.logger.log('[UserLeave]', uid);

        /**
        * @en if game is playing, game over. otherwise, clean seat.
        * @zh 如果游戏正在进行中，则不做任何处理 
        **/
        for (let i = 0; i < this._roomData.userList.length; ++i) {
            let u = this._roomData.userList[i];
            if (u.uid == uid) {
                if (!u.playerId) {
                    this._roomData.userList.splice(i, 1);
                    this._userMap.delete(u.uid);
                }
                break;
            }
        }

        await MasterSrvRPC.get().updateUserLocation([uid], { serverUrl: ServerGlobals.options.internalUrl, roomId: '', gameType: '' });

        this.broadcastMsg("room/UserLeavesFromRoomPush", { uid: uid });

        this.conns.removeOne(v => v === conn);
        //this._data.users.removeOne(v => v.uid === currentUser.uid);
        //delete this.players[currentUser.uid]
        this.lastUpdateTime = Date.now();

        if (conn) {
            this.unlistenMsgs(conn);
        }

        if (this.conns.length === 0) {
            this.lastEmptyTime = Date.now();
        }

        this._stateDirty = true;
    }

    //should be implemented by derived class when needed.
    onUpdate(deltaTime: number) { }
}