import { ApiReturn } from "tsrpc";
import { HttpRPC } from "../common/HttpRPC";
import { ServerGlobals } from "../common/ServerGloabls";
import { ResGetRoomListByType } from "../privateProtocols/match/PtlGetRoomListByType";
import { ReqUpdateRoomState } from "../privateProtocols/match/PtlUpdateRoomState";

const cacheUpdateInterval = 500;

export class MatchSrvRPC extends HttpRPC {
    public static get(): MatchSrvRPC {
        return MatchSrvRPC.getRPCClient(ServerGlobals.matchUrl, MatchSrvRPC) as MatchSrvRPC;
    }

    private _roomListCache: { [key: string]: { lastUpdateTime: number, cache: ApiReturn<ResGetRoomListByType> } } = {}

    async addToMatchQueue(uid: string, type: string, immediate?: boolean) {
        return this._httpClient.callApi("match/StartMatch", { uid: uid, type: type, immediate: immediate }, { timeout: 60000 });
    }

    async cancelMatch(uid: string) {
        return this._httpClient.callApi("match/CancelMatch", { uid: uid });
    }

    async getRoomList(gameType: string) {
        let cache = this._roomListCache[gameType];
        if (cache && cache.lastUpdateTime + cacheUpdateInterval > Date.now()) {
            return cache.cache;
        }
        let ret = await this._httpClient.callApi("match/GetRoomListByType", { gameType: gameType });
        this._roomListCache[gameType] = {
            lastUpdateTime: Date.now(),
            cache: ret
        }

        return ret;
    }

    async createRoomOnMinLoadServer(uid: string, roomName: string, gameType: string, password: string) {
        return await this._httpClient.callApi("match/CreateRoomOnMinLoadServer", { uid: uid, roomName: roomName, gameType: gameType, password: password });
    }

    async getRoomState(roomId: string) {
        return await this._httpClient.callApi("match/GetRoomServerState", { roomId: roomId });
    }

    async updateRoomState(states: ReqUpdateRoomState) {
        await this.httpClient.callApi('match/UpdateRoomState', states);
    }
}