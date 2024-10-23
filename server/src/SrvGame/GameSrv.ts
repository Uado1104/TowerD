import { ApiCall, WsConnection } from "tsrpc";
import { ServiceType as ServiceType_Private } from "../privateProtocols/serviceProto_private";
import { UserInfo } from "../shared/types/UserInfo";
import { Room } from "./Room";
import { MsgChatTransform } from "../privateProtocols/game/MsgChatTransform";
import { RoomGame } from "./RoomGame";
import { ServerArgs } from "../common/ServerArgs";
import { GameClientConn, WebsocketGameServer, websocketPublicServer } from "../common/WebsocketGameServer";
import { ReqKickUser, ResKickUser } from "../privateProtocols/game/PtlKickUser";
import { MasterSrvRPC } from "../SrvMaster/MasterSrvRPC";
import { IRoomServerInfo, IRoomFullState, IRoomUpdateState } from "../privateProtocols/game/RoomStateDef";
import { ReqUpdateRoomState } from "../privateProtocols/match/PtlUpdateRoomState";
import { ServerGlobals } from "../common/ServerGloabls";
import { ServerState, ServerType } from "../shared/types/ServerDef";
import { MatchSrvRPC } from "../SrvMatch/MatchSrvRPC";

interface ClientUserState {
    uid: string;
    info: UserInfo;
    conn: GameClientConn;
    state: 'loggined' | '';
    roomId?: string;
    gameType: string;
}

export class GameSrv {
    /***
     * @en used to mark the unique start sequence
     * @zh 用于标记唯一一次启动序列
     */
    private _instanceId: number = Date.now();

    /**
     * @en if this flag is true, the system won't create new room and match users for this RoomServer (still could join in by roomId).
     * @zh 如果此标记为 true, 则此 RoomServer 会再创建新的房间和匹配新的玩家（依然可以通过房间号进入）。
     */
    private _disabled: boolean = false;

    private _userStates = new Map<string, ClientUserState>();

    private _roomStateUpdates: ReqUpdateRoomState = {} as ReqUpdateRoomState;

    public readonly allRoomsMap = new Map<string, Room>();

    public updateTimeCost: number = 0;

    public websocketServer: WebsocketGameServer | undefined;

    serverState: ServerState | undefined;

    kickUser(call: ApiCall<ReqKickUser, ResKickUser, any>) {
        if (!call.req.uid) {
            return call.error('uid is required');
        }

        if (this._userStates.has(call.req.uid)) {
            let info = this._userStates.get(call.req.uid);
            if (info?.state == 'loggined') {
                this._userStates.delete(call.req.uid);
                call.succ({});
            }
            else {
                call.error('user is not loggined');
            }
        }
        call.succ({});
    }

    constructor() {
    }

    async init() {
        let args = ServerGlobals.options;
        if (!args.servicesMap['game'] || !args.gameTypes.length) {
            return;
        }

        this.websocketServer = websocketPublicServer;
        this.serverState = {
            type: ServerType.Game,
            interalUrl: ServerGlobals.options.internalUrl,
            publicUrl: ServerGlobals.options.publicWsUrl,
            userNum: 0,
            roomNum: 0,
        };
    }

    async start() {

        if (!this.websocketServer) {
            return;
        }
        
        this._roomStateUpdates = {
            internalUrl: ServerGlobals.options.internalUrl,
            instanceId: this._instanceId,
            updateRooms: [],
            deleteRooms: [],
        };


        const FPS = 10;
        const deltaTime = 1000 / FPS;
        setInterval(() => {
            this._updateRooms(deltaTime);
        }, deltaTime);


        //@en report state every second
        //@zh 每500ms上报一次状态
        setInterval(() => {
            this.updateRoomStates();
            this.reportServerState();
        }, 500);

        //@en report state at first time
        //@zh 第一次启动，主动上报
        this.reportServerState();
    }

    async tryEnterRoom(conn: GameClientConn, roomId: string, gameType: string, user: UserInfo): Promise<undefined | { message: string, info?: any }> {
        let room = this.allRoomsMap.get(roomId);
        if (!room) {
            return { message: '房间不存在', info: { code: 'ROOM_NOT_EXISTS' } };
        }

        //如果用户不在房间中，则需要判断是否超出限制。
        if (!room.isPlayer(conn.uid!) && room.userNum >= room.maxUser) {
            return { message: '房间已满员' };
        }

        // 用户已经在本子世界中，可能是通过其它设备登录，踢出旧连接
        for (let i = room.conns.length - 1; i >= 0; --i) {
            let c = room.conns[i];
            if (!c.uid || c.uid === conn.uid) {
                room.conns.splice(i, 1);
            }
        }

        // 用户正在其它子世界中，从之前的子世界中退出
        if (conn.curRoom) {
            await conn.curRoom.onRPC_Leave(conn);
        }

        room.onRPC_Enter(conn, user);

        room.conns.push(conn);
        conn.curRoom = room;
        room.listenMsgs(conn);
        room.lastEmptyTime = undefined;
        room.lastUpdateTime = Date.now();

        MasterSrvRPC.get().updateUserLocation([conn.uid!], { serverUrl: ServerGlobals.options.internalUrl, roomId: room.state.id, gameType: room.state.gameType });
    }

    /**
     * 注册到 MasterServer
     */
    async joinMasterServer() {
        // 防止重复连接
        if (this.masterServerConn || this._isJoiningMasterServer) {
            return;
        }
    }
    private _isJoiningMasterServer?: boolean;
    masterServerConn?: WsConnection<ServiceType_Private>;
    //
    createRoom(roomId: string, displayId: string, roomName: string, gameType: string, password?: string): Room | null {
        if (!roomName) {
            roomName = displayId;
        }
        let roomCls = Room;
        if (gameType == 'normal') {
            roomCls = RoomGame;
        }
        let newRoom = new roomCls(roomId, gameType, displayId, roomName, password);

        this.allRoomsMap.set(newRoom.id, newRoom);
        return newRoom;
    }

    public broadcastInRoom(room: Room, msg: any) {
        const MAX_CACHED_MESSAGES = 20;
        let len = room.messages.push(msg);
        if (len >= MAX_CACHED_MESSAGES) {
            room.messages.shift();
        }

        room.broadcastMsg('chat/Chat', msg);
    }

    public broadcastInAllRooms(msg: MsgChatTransform) {
        this.allRoomsMap.forEach(v => {
            if (msg.channel == 'global' || msg.channel == v.gameType) {
                this.broadcastInRoom(v, msg);
            }
        });
    }

    getAllUserLocations() {
        let ret: {
            uid: string,
            roomId?: string,
            gameType?: string
        }[] = [];
        this._userStates.forEach(state => {
            ret.push({
                uid: state.uid,
                roomId: state.roomId,
                gameType: state.gameType,
            });
        });
        return ret;
    }

    getAllRoomStates(): IRoomServerInfo {
        let allRoomStates: IRoomFullState[] = [];
        this.allRoomsMap.forEach(v => {
            allRoomStates.push(v.state);
        });
        return {
            instanceId: this._instanceId,
            internalUrl: ServerGlobals.options.internalUrl,
            publicUrl: ServerGlobals.options.publicWsUrl,
            supportedGameTypes: ServerGlobals.options.gameTypes!,
            maxRoomNum: ServerGlobals.options.maxRoomNum,
            rooms: allRoomStates,
        };
    }

    roomChanged(state: IRoomUpdateState) {
        for (let i = 0; i < this._roomStateUpdates.updateRooms.length; ++i) {
            let rs = this._roomStateUpdates.updateRooms[i];
            if (rs.id === state.id) {
                this._roomStateUpdates.updateRooms[i] = state;
                return;
            }
        }

        this._roomStateUpdates.updateRooms.push(state);
    }

    roomDeleted(id: string) {
        this.allRoomsMap.delete(id);

        this._roomStateUpdates.deleteRooms.push(id);
    }

    private _updateRooms(deltaTime: number) {
        let time = Date.now();
        this.allRoomsMap.forEach(v => {
            v.update(deltaTime);
        });
        this.updateTimeCost = Date.now() - time;
    }

    private async updateRoomStates() {
        await MatchSrvRPC.get().updateRoomState(this._roomStateUpdates);
        this._roomStateUpdates.updateRooms = [];
        this._roomStateUpdates.deleteRooms = [];
    }

    reportServerState() {
        if (this.serverState) {
            this.serverState.userNum = this.websocketServer!.userNum;
            this.serverState.roomNum = gameSrv.allRoomsMap.size;
            this.serverState.updateTimeCost = gameSrv.updateTimeCost;
            MasterSrvRPC.get().reportServer(this.serverState);
        }
    }
}

export const gameSrv = new GameSrv();