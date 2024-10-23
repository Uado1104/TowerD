import chalk from 'chalk';
import { ApiCall, ApiReturn, ConnectionStatus, TsrpcError } from "tsrpc";
import { IRoomServerInfo, IRoomFullState } from "../privateProtocols/game/RoomStateDef";
import { TokenUtils } from "../common/TokenUtils";
import { ReqStartMatch, ResStartMatch } from "../privateProtocols/match/PtlStartMatch";
import { ReqCancelMatch, ResCancelMatch } from "../privateProtocols/match/PtlCancelMatch";
import { ServerArgs } from "../common/ServerArgs";
import { internalRPCHttpService } from "../common/HttpGameServer";
import { GameSrvRPC } from "../SrvGame/GameSrvRPC";
import { ReqCreateRoomOnMinLoadServer, ResCreateRoomOnMinLoadServer } from "../privateProtocols/match/PtlCreateRoomOnMinLoadServer";
import { MasterSrvRPC } from "../SrvMaster/MasterSrvRPC";
import { ServerGlobals } from "../common/ServerGloabls";
import { ReqUpdateRoomState } from "../privateProtocols/match/PtlUpdateRoomState";

export class MatchSrv {

    /** key: room server internalUrl */
    roomServers = new Map<string, IRoomServerInfo>();
    /** key: roomId */
    roomStateMap = new Map<string, IRoomFullState>();

    /**
     * @en rooms that can be matched.
     * @zh 处于匹配中的房间
    */
    roomMatchingMap = new Map<string, IRoomFullState>();

    usedRoomDisplayId = new Map<string, boolean>();

    // #region 匹配相关
    /** 待匹配队列 */
    matchQueue = new Map<string, ApiCall<ReqStartMatch, ResStartMatch>>();

    constructor() {
    }

    async init() {

    }

    async start() {
        if (!ServerGlobals.options.servicesMap['match']) {
            return;
        }
        internalRPCHttpService.logger.warn(chalk.greenBright(`[Private] Match Service Stared.`));
        setInterval(async () => { this.update(); }, 3000);
        // 定时执行匹配
        this.update();
    }

    async update() {
        await this.refreshGameServerState();
        await this.startMatch();
    }

    async refreshGameServerState() {
        let deleteKeys:string[] = [];
        let validTimestamp = Date.now() - 1000;
        this.roomServers.forEach((roomServer,key) => {
            let isOffline = roomServer?.lastUpdateTime! < validTimestamp;
            //if the server is offline, then clean the rooms of it
            //如果服务器不在线，则清理掉它的房间
            if (isOffline) {
                deleteKeys.push(key);
            }
        });

        deleteKeys.forEach(key=>{
            let roomServer = this.roomServers.get(key);
            this.cleanRoomsOnServer(roomServer);
            this.roomServers.delete(key);
        });
    }

    cleanRoomsOnServer(roomServer: IRoomServerInfo | undefined) {
        if (roomServer) {
            console.log('clear rooms on server:', roomServer.publicUrl)
            this.roomServers.delete(roomServer.internalUrl);
            roomServer.rooms.forEach(v => {
                this.removeRoom(v);
            });
        }
    }

    async getAllRoomStates(internalUrl: string) {
        let ret = await GameSrvRPC.get(internalUrl).getRoomStates();
        if (!ret.isSucc) {
            return;
        }
        let roomServer = ret.res;

        roomServer.rooms.forEach(v => {
            v.serverInternalUrl = roomServer.internalUrl;
            v.serverPublicUrl = roomServer.publicUrl;
            this.addNewRoom(v);
        });

        this.roomServers.set(roomServer.internalUrl, roomServer);
        roomServer.lastUpdateTime = Date.now();
    }

    addNewRoom(room: IRoomFullState) {
        this.usedRoomDisplayId.set(room.displayId, true);
        this.roomStateMap.set(room.id, room);
        this.roomStateMap.set(room.displayId, room);
        if (!room.isPlaying) {
            this.roomMatchingMap.set(room.id, room);
        }
    }

    removeRoom(room: IRoomFullState, roomServer?: IRoomServerInfo | undefined) {
        this.roomStateMap.delete(room.id);
        this.roomStateMap.delete(room.displayId);
        this.usedRoomDisplayId.delete(room.displayId);
        this.roomMatchingMap.delete(room.id);
        if (roomServer) {
            for (let i = 0; i < roomServer.rooms.length; ++i) {
                let r = roomServer.rooms[i];
                if (r.id === room.id) {
                    roomServer.rooms.splice(i, 1);
                    break;
                }
            }
        }
    }

    async updateRoomStates(updates: ReqUpdateRoomState) {
        let roomServer = this.roomServers.get(updates.internalUrl);
        if (!roomServer || roomServer.instanceId != updates.instanceId) {
            //新的实例，需要更新房间信息
            this.cleanRoomsOnServer(roomServer);
            this.getAllRoomStates(updates.internalUrl);
            return;
        }

        roomServer.lastUpdateTime = Date.now();

        if (updates.updateRooms && updates.updateRooms.length) {
            updates.updateRooms.forEach(v => {
                let roomState = this.roomStateMap.get(v.id);
                if (roomState) {
                    roomState.userNum = v.userNum;
                    roomState.playerNum = v.userNum;
                    if (roomState.isPlaying != v.isPlaying) {
                        roomState.isPlaying = v.isPlaying;
                        if (roomState.isPlaying) {
                            this.roomMatchingMap.delete(roomState.id);
                        }
                        else {
                            this.roomMatchingMap.set(roomState.id, roomState);
                        }
                    }
                }
            });
        }

        if (updates.deleteRooms && updates.deleteRooms.length) {
            updates.deleteRooms.forEach(v => {
                let room = this.roomStateMap.get(v);
                if (room) {
                    this.removeRoom(room);
                }
            });
        }
    }

    public getRoomState(roomId: string) {
        return this.roomStateMap.get(roomId);
    }

    async startMatch() {
        await this._doMatch().catch(e => {
            internalRPCHttpService.server.logger.error('[MatchError]', e);
        });
    }

    async addToMatchQueue(call: ApiCall<ReqStartMatch, ResStartMatch>) {
        let conn = call.conn;
        let c = this.matchQueue.get(call.req.uid);
        if (c) {
            return;
        }
        if (call.req.immediate) {
            await this.quickMatch(call);
        }
        else {
            // 加入匹配队列，待匹配
            this.matchQueue.set(call.req.uid, call);
        }
    }

    async removeFromMatchQueue(call: ApiCall<ReqCancelMatch, ResCancelMatch>) {
        let conn = call.conn;
        let c = this.matchQueue.get(call.req.uid);
        if (c) {
            this.matchQueue.delete(call.req.uid);
        }
        return call.succ({});
    }

    async quickMatch(call: ApiCall<ReqStartMatch, ResStartMatch>) {
        let gameType = call.req.type;
        let bestMatchedSubWorld = this.getBestMatchedNoFullSubWorld(gameType);
        // 尝试匹配，你可以在此实现自己的匹配规则            
        // 这里简单起见，优先匹配人多的子世界
        let serverUrl: string = '';
        let roomId: string = '';
        if (bestMatchedSubWorld) {
            serverUrl = bestMatchedSubWorld.serverPublicUrl!;
            roomId = bestMatchedSubWorld!.id;
        }
        else {

            /*
            //uncomment this line to enable room server performance testing
            //解开注释，进行房间服负载测试
            for(let i = 0; i < 100; ++i){
                await this._createRoom('', gameType, '');
            }
            */

            // 没有合适的子世界，那么创建一个子世界
            let retCreateSubWorld = await this._createRoom('', gameType, '');
            if (retCreateSubWorld.isSucc) {
                serverUrl = retCreateSubWorld.res.serverUrl;
                roomId = retCreateSubWorld.res.roomId;
            }
            else {
                console.error(retCreateSubWorld.err);
            }
        }

        if (serverUrl && roomId) {
            let enterParams = TokenUtils.createEnterRoomParams(
                call.req.uid,
                serverUrl,
                roomId,
                gameType,
            );
            call.succ(enterParams);
            return true;
        }

        return false;
    }


    getBestMatchedNoFullSubWorld(configId: string): IRoomFullState | null {
        let roomState: IRoomFullState | null = null;
        let minPlayerNum = 1000000000;
        this.roomMatchingMap.forEach(v => {
            if (v.gameType == configId && v.playerNum < v.maxPlayerNum && !v.password && v.playerNum < minPlayerNum) {
                roomState = v;
                minPlayerNum = v.playerNum;
            }
        });
        return roomState;
    }


    /**
     * 执行一次匹配
     */
    private async _doMatch() {
        internalRPCHttpService.server.logger.log(`匹配开始，匹配人数=${this.matchQueue.size}`);
        let succNum = 0;

        this.matchQueue.forEach(async (call, key) => {
            let conn = call.conn;
            // 连接已断开，不再匹配
            if (call.conn.status !== ConnectionStatus.Opened) {
                this.matchQueue.delete(key);
            }

            let bSuc = await this.quickMatch(call);
            if (bSuc) {
                succNum++;
                this.matchQueue.delete(key);
            }
        });

        internalRPCHttpService.server.logger.log(`匹配结束，成功匹配人数=${succNum}`)
    }
    // #endregion

    genRoomDisplayId() {
        let roomId = '';
        while (true) {
            roomId = TokenUtils.genID(6, true);
            if (!this.usedRoomDisplayId.has(roomId)) {
                break;
            }
        }
        return roomId;
    }

    getMinLoadRoomServer(gameType: string): IRoomServerInfo | undefined {
        let minLoadServer: IRoomServerInfo | undefined = undefined;
        this.roomServers.forEach(roomServer => {
            if (roomServer.rooms.length < roomServer.maxRoomNum && roomServer.supportedGameTypes.indexOf(gameType) != -1) {
                if (!minLoadServer || roomServer!.rooms.length < minLoadServer!.rooms.length) {
                    minLoadServer = roomServer;
                }
            }
        });

        return minLoadServer;
    }

    async createRoom(call: ApiCall<ReqCreateRoomOnMinLoadServer, ResCreateRoomOnMinLoadServer>): Promise<ApiReturn<ResCreateRoomOnMinLoadServer>> {
        return await this._createRoom(call.req.roomName, call.req.gameType, call.req.password);
    }


    private async _createRoom(roomName: string, gameType: string, password: string): Promise<ApiReturn<ResCreateRoomOnMinLoadServer>> {

        // 挑选一个人数最少的 WorldServer
        let roomServer = this.getMinLoadRoomServer(gameType);
        if (!roomServer) {
            return { isSucc: false, err: new TsrpcError('没有可用的房间服务器') };
        }

        let displayId = this.genRoomDisplayId();
        this.usedRoomDisplayId.set(displayId, true);
        let roomId = gameType + '_' + Date.now() + displayId;
        // RPC -> WorldServer
        let op = await GameSrvRPC.get(roomServer.internalUrl).httpClient.callApi("game/CreateRoom", {
            roomName: roomName,
            roomId: roomId,
            displayId: displayId,
            gameType: gameType,
            password: password,
        })
        if (!op.isSucc) {
            this.usedRoomDisplayId.delete(displayId);
            return { isSucc: false, err: new TsrpcError(op.err) };
        }

        let roomState = op.res.state;
        roomState.serverPublicUrl = roomServer.publicUrl;
        roomState.serverInternalUrl = roomServer.internalUrl;
        roomServer.rooms.push(roomState);
        this.addNewRoom(roomState);

        // Return
        return {
            isSucc: true,
            res: {
                roomId: roomState.id,
                serverUrl: roomServer.publicUrl
            }
        }
    }
}


export const matchSrv = new MatchSrv();