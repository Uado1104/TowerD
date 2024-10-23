import { TextAsset, assetManager } from "cc";
import { GameServerAuthParams } from "../shared/types/GameServerAuthParams";
import { GameServerListFileURL, GameServerURLs } from "./FrontConfig";
import { WebsocketClient } from "./WebsocketClient";
import { UserLocalCache } from "./UserLocalCache";
import { ApiReturn, HttpClient } from "tsrpc-browser";

import { ServiceType } from "../shared/protocols/serviceProto_public";
import { NetUtil } from "./NetUtil";
import { LOBBY_USE_HTTP } from "../shared/configs/Constants";
import { ResLogin } from "../shared/protocols/public/login/PtlLogin";

export class NetLobbyServer extends WebsocketClient {
    public authParams: ResLogin;
    constructor() {
        super();
        console.log('Lobby Connection created as Websocket');
    }
}

export class HttpLobbyServer {
    private _globalErrorFilters = {};

    public addErrorFilter(error: string, cb: Function, target?: any) {
        this._globalErrorFilters[error] = { cb: cb, target: target };
    }

    private _http: HttpClient<ServiceType>;
    private _serverUrl = '';

    public authParams: ResLogin;

    public get type() {
        return 'http';
    }

    public get serverUrl() {
        return this._serverUrl;
    }

    constructor(){
        console.log('Lobby Connection created as HTTP');
    }

    createConnection(serverUrls: Readonly<string[]>) {
        let index = Math.floor(serverUrls.length * Math.random());
        let serverUrl = serverUrls[index];
        this._serverUrl = serverUrl;
        this._http = NetUtil.createHttpClient(this._serverUrl);
    }

    public async callApi<T extends string & keyof ServiceType['api']>(apiName: T, req: ServiceType['api'][T]['req'], options?: any): Promise<ApiReturn<ServiceType['api'][T]['res']>> {
        if(this.authParams){
            req['token'] = this.authParams.token;
        }
        let ret = await this._http?.callApi(apiName, req, options);
        if(!ret.isSucc){
            let filter = this._globalErrorFilters[ret.err.message];
            if(filter){
                filter.cb.call(filter.target, ret.err);
            }
        }
        return ret;
    }
}

export class NetGameServer extends WebsocketClient {

    public authParams: GameServerAuthParams;
    public async connectToRoomServer(params: GameServerAuthParams) {
        this.authParams = params;
        this.createConnection([params.serverUrl]);
        return true;
    }

    public async joinRoomServer(uid: string) {
        let retJoin = await this.conn.callApi('game/AuthClient', {
            sign: this.authParams.token,
            uid: uid,
            time: this.authParams.time,
            roomId: this.authParams.roomId,
            gameType: this.authParams.gameType,
            roleName: UserLocalCache.inst.getRoleName(uid),
        });

        return retJoin;
    }
}

export const loginNet = new HttpLobbyServer();
export const lobbyNet = LOBBY_USE_HTTP ? new HttpLobbyServer() : new NetLobbyServer();
export const gameNet = new NetGameServer();