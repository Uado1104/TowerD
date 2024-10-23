import chalk from 'chalk';
import { ServerArgs } from "../common/ServerArgs";
import { internalRPCHttpService } from "../common/HttpGameServer";
import { ServerState, ServerType } from "../shared/types/ServerDef";
import { ServerGlobals } from "../common/ServerGloabls";
import { GameSrvRPC } from "../SrvGame/GameSrvRPC";

interface IUserLocation {
    /**
     * @en the server url where the user is currently located, unique in the cluster
     * @zh 用户当前所在的游戏服务器地址，集群内唯一
    */
    serverUrl: string;

    /**
     * the user's room id, null or '' means not in a room
     * 用户所在房间ID, 为空表示不在房间中
    */
    roomId: string;

    /**
     * @zh user's game type
     * @zh 用户所在的游戏类型
    */
    gameType: string;
}

export class MasterSrv {

    userLocs: { [key: string]: IUserLocation } = {};

    /** 已注册的 GameServer */
    private _gameServerMap: { [key: string]: ServerState } = {};
    private _gameServerList: ServerState[] = [];

    /** 已注册的 LobbyServer */
    private _lobbyServerMap: { [key: string]: ServerState } = {};
    private _lobbyServerList: ServerState[] = [];

    public get gameServerMap() { return this._gameServerMap; }
    public get gameServerList() { return this._gameServerList; }
    public get lobbyServerMap() { return this._lobbyServerMap; }
    public get lobbyServerList() { return this._lobbyServerList; }


    constructor() {
    }

    async init() {

    }

    async start() {
        if (!ServerGlobals.options.servicesMap['master']) {
            return;
        }

        internalRPCHttpService.logger.warn(chalk.greenBright(`[Private] Master Service Stared.`));
        // 检查服务器是否存活
        setInterval(() => {
            this.update();
        }, 3000);
    }

    async update() {
        let lobbyUserNum = 0;
        let gameUserNum = 0;
        let roomNum = 0;
        let lobbyServices: ServerState[] = [];
        let gameServices: ServerState[] = [];
        this._gameServerList = [];
        this._lobbyServerList = [];

        let keys = Object.keys(this._gameServerMap);
        keys.forEach(key => {
            let serverState = this._gameServerMap[key];
            if (!serverState || Date.now() - serverState.lastUpdateTime! > 1000) {
                delete this._gameServerMap[key];
            }
            else {
                this._gameServerList.push(serverState);
                gameServices.push(serverState);
                gameUserNum += serverState.userNum!;
                roomNum += serverState.roomNum!;
            }
        });

        keys = Object.keys(this._lobbyServerMap);
        keys.forEach(key => {
            let serverState = this._lobbyServerMap[key];
            if (!serverState || Date.now() - serverState.lastUpdateTime! > 1000) {
                delete this._lobbyServerMap[key];
            }
            else {
                this._lobbyServerList.push(serverState);
                lobbyServices.push(serverState);
                lobbyUserNum += serverState.userNum!;
            }
        });

        //return;
        internalRPCHttpService.logger.warn(`
        [MasterServer 状态播报]
          - 大厅服数量=${lobbyServices.length}
          - 大厅服人数=总:${lobbyUserNum}, [${lobbyServices.map(v => v.userNum).join(',')}]
          - 游戏服数量=${gameServices.length}
          - 游戏服人数=总:${gameUserNum}, [${gameServices.map(v => v.userNum).join(',')}]
          - 游戏服房间数量=总:${roomNum}, [${gameServices.map(v => v.roomNum).join(',')}]
          - 游戏服更新耗时ms=${gameServices.map(v => v.updateTimeCost).join(',')}
        `);
    }

    getUserLocation(uid: string) {
        let loc = this.userLocs[uid];
        if (!loc || !this._gameServerMap[loc.serverUrl]) {
            delete this.userLocs[uid];
            return {};
        }
        return loc;
    }

    updateUserLocation(uids: string[], serverUrl?: string, roomId?: string, gameType?: string) {
        if (uids && uids.length) {
            uids.forEach(uid => {
                if (!uid) {
                    return;
                }
                let loc = this.userLocs[uid] || { serverUrl: '', roomId: '' };
                this.userLocs[uid] = loc;
                if (serverUrl == 'kick') {
                    delete this.userLocs[uid];
                }
                else {
                    if (serverUrl != undefined) {
                        loc.serverUrl = serverUrl;
                    }
                    if (roomId != undefined) {
                        loc.roomId = roomId;
                    }
                    if (gameType != undefined) {
                        loc.gameType = gameType;
                    }
                }
            });
        }
    }

    async updateServerState(serverState: ServerState) {
        if (serverState.type == ServerType.Lobby) {
            this._updateServerState(serverState, this._lobbyServerMap, this._lobbyServerList);
        }
        else if (serverState.type == ServerType.Game) {
            this._updateServerState(serverState, this._gameServerMap, this._gameServerList);
        }
    }

    async _updateServerState(serverState: ServerState, serverMap: { [key: string]: ServerState }, serverList: ServerState[]) {
        serverState.lastUpdateTime = Date.now();
        let notExisted = serverMap[serverState.interalUrl!];
        serverMap[serverState.interalUrl!] = serverState;
        if (notExisted) {
            serverList.push(serverState);
            /**
             * @en first register, sync data
             * @zh 首次注册，同步数据
            */
            let ret = await GameSrvRPC.get(serverState.interalUrl!).getAllUserLocations();
            if (ret.isSucc) {
                let locations = ret.res.locations;
                for (let i = 0; i < locations.length; ++i) {
                    let loc = locations[i];
                    this.updateUserLocation([loc.uid], serverState.interalUrl!, loc.roomId, loc.gameType);
                }
            }
        }
    }
}


export const masterSrv = new MasterSrv();