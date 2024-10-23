import { ApiReturn, HttpClient } from "tsrpc";
import { ResGetGameServerList } from "../privateProtocols/master/PtlGetGameServerList";
import { ResGetMatchServerList } from "../privateProtocols/master/PtlGetMatchServerList";
import { ServerState } from "../shared/types/ServerDef";
import { IRoomFullState } from "../privateProtocols/game/RoomStateDef";
import { HttpRPC } from "../common/HttpRPC";
import { ServerGlobals } from "../common/ServerGloabls";
import { ResGetGameServerMap } from "../privateProtocols/master/PtlGetGameServerMap";
import { ResGetLobbyServerList } from "../privateProtocols/master/PtlGetLobbyServerList";

/**
 * @en use this class to access Master service, and cache the data returned by Master service to prevent Master service from being overloaded by user requests
 * @zh 用于集群内其他进程方便访问 Master 服务,同时缓存 Master 服务返回的数据，以防止被用户请求对Master服务造成压力
*/

const cacheUpdateTime = 500;
export class MasterSrvRPC extends HttpRPC {

    private _lastLobbyerverListFetchTime: number = 0;
    private _lobbyServerList!: ApiReturn<ResGetLobbyServerList>;

    private _lastGameServerListFetchTime: number = 0;
    private _gameServerList!: ApiReturn<ResGetGameServerList>;

    private _lastGameServerMapFetchTime: number = 0;
    private _gameServerMap!: ApiReturn<ResGetGameServerMap>;

    private _lastMatchServerFetchTime: number = 0;
    private _matchServerList!: ApiReturn<ResGetMatchServerList>;

    public static get(): MasterSrvRPC {
        return MasterSrvRPC.getRPCClient(ServerGlobals.masterUrl, MasterSrvRPC) as MasterSrvRPC;
    }

    constructor(serverUrl: string) {
        super(serverUrl);
    }

    public async getLobbyServerList() {
        if (Date.now() - this._lastLobbyerverListFetchTime < cacheUpdateTime) {
            return this._lobbyServerList;
        }
        let ret = await this._httpClient.callApi("master/GetLobbyServerList", {});
        this._lobbyServerList = ret;
        this._lastLobbyerverListFetchTime = Date.now();

        return this._lobbyServerList;
    }


    public async getGameServerList() {
        if (Date.now() - this._lastGameServerListFetchTime < cacheUpdateTime) {
            return this._gameServerList;
        }
        let ret = await this._httpClient.callApi("master/GetGameServerList", {});
        this._gameServerList = ret;
        this._lastGameServerListFetchTime = Date.now();

        return this._gameServerList;
    }

    public async getGameServerMap() {
        if (Date.now() - this._lastGameServerMapFetchTime < cacheUpdateTime) {
            return this._gameServerMap;
        }
        let ret = await this._httpClient.callApi("master/GetGameServerMap", {});
        this._gameServerMap = ret;
        this._lastGameServerMapFetchTime = Date.now();

        return this._gameServerMap;
    }

    public async getMatchServerList(): Promise<ApiReturn<ResGetMatchServerList>> {
        if (Date.now() - this._lastMatchServerFetchTime < cacheUpdateTime) {
            return this._matchServerList;
        }
        let ret = await this._httpClient.callApi("master/GetMatchServerList", {});
        this._matchServerList = ret;
        this._lastMatchServerFetchTime = Date.now();
        return ret;
    }

    public reportServer(serverInfo: ServerState) {
        this._httpClient.callApi("master/ReportServerState", { state: serverInfo });
    }

    async userLoginPrepare(uid: string, serverUrl: string) {
        return await this._httpClient.callApi("master/UserLoginPrepare", { uid: uid, serverUrl: serverUrl });
    }

    async getUserLocation(uid: string) {
        return await this._httpClient.callApi("master/GetUserLocation", { uid: uid });
    }

    async updateUserLocation(uids: string[], params: { serverUrl?: string, roomId?: string, gameType?: string }) {
        return await this._httpClient.callApi("master/UpdateUserLocation", { uids: uids, serverUrl: params.serverUrl, roomId: params.roomId, gameType: params.gameType });
    }
}