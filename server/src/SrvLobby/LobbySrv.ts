import { MasterSrvRPC } from "../SrvMaster/MasterSrvRPC";
import { HttpGameServer, httpPublicServer } from "../common/HttpGameServer";
import { ServerGlobals } from "../common/ServerGloabls";
import { GameClientConn, WebsocketGameServer, websocketPublicServer } from "../common/WebsocketGameServer";
import { dbUser } from "../db/DBMgr";
import { LOBBY_USE_HTTP } from "../shared/configs/Constants";
import { ServerState, ServerType } from "../shared/types/ServerDef";

export class LobbySrv {

    constructor() {
    }

    private _httpLobbyServer: HttpGameServer | undefined;
    private _websocketLobbyServer: WebsocketGameServer | undefined;

    private _onlineUserMap = new Map<string, number>();

    serverState: ServerState | undefined;

    async init() {
        if(!ServerGlobals.options.servicesMap['lobby']){
            return;
        }

        if (LOBBY_USE_HTTP) {
            this._httpLobbyServer = httpPublicServer;
            this._httpLobbyServer.server.flows.preApiCallFlow.push(async call=>{
                if(call.service.name?.indexOf('lobby/') === 0){
                    let userInfo = await dbUser.getUserInfoByToken(call.req.token!);
                    if(!userInfo){
                        call.error('INVALID_TOKEN');
                    }
                    else{
                        (call.conn as GameClientConn).uid = userInfo.uid;
                        (call.conn as GameClientConn).dbUserInfo = userInfo;
    
                        //@en Record the last message time of this user
                        //@zh 记录此用户最近一次的消息时间
                        this._onlineUserMap.set(userInfo.uid!, Date.now());
                    }
                }
                return call;
            });

            this.serverState = {
                type: ServerType.Lobby,
                interalUrl: ServerGlobals.options.internalUrl,
                publicUrl: ServerGlobals.options.publicHttpUrl,
                userNum: 0,
            };
        }
        else {
            this._websocketLobbyServer = websocketPublicServer;
            this.serverState = {
                type: ServerType.Lobby,
                interalUrl: ServerGlobals.options.internalUrl,
                publicUrl: ServerGlobals.options.publicWsUrl,
                userNum: 0,
            };
        }
    }

    async start() {
        if(!ServerGlobals.options.servicesMap['lobby']){
            return;
        }

        if (this._httpLobbyServer) {
            //@en HTTP needs to start a separate online user statistics
            //@zh HTTP 需要启动单独的在线人数统计
            setInterval(()=>{
                this.checkOnlineUsers();    
            },10000);
        }

        if (this._websocketLobbyServer || this._httpLobbyServer) {
            //@en report state every second
            //@zh 每500ms上报一次状态
            setInterval(() => {
                this.reportServerState();
            }, 500);

            //@en report state at first time
            //@zh 第一次启动，主动上报
            this.reportServerState();
        }
    }

    checkOnlineUsers(){
        //@en if no message received in 15 seconds, consider offline
        //@zh 如果 15 秒内没有收到消息，则视为已下线
        let validTimestamp = Date.now() - 15000;
        let deleteKeys:string[] = [];
        this._onlineUserMap.forEach((lastMsgTime, key) => {
            if(!lastMsgTime || lastMsgTime < validTimestamp){
                deleteKeys.push(key);
            }
        });

        deleteKeys.forEach(key=>{
            this._onlineUserMap.delete(key);
        });
    }

    reportServerState() {
        if (this.serverState) {
            if (this._websocketLobbyServer) {
                this.serverState.userNum = this._websocketLobbyServer!.userNum;
            }
            else if(this._httpLobbyServer){
                this.serverState.userNum = this._onlineUserMap.size;
            }
            MasterSrvRPC.get().reportServer(this.serverState);
        }
    }
}



export const lobbySrv = new LobbySrv();