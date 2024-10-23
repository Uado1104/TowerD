import chalk from "chalk";
import path from "path";
import { ApiCall, BaseConnection, FlowNode, Logger, WsConnection, WsServer } from "tsrpc";
import { serviceProto as serviceProto_Public, ServiceType as ServiceType_Public } from "../shared/protocols/serviceProto_public";
import { NetworkUtil } from "./NetworkUtil";
import { Room } from "../SrvGame/Room";
import { ServerGlobals } from "./ServerGloabls";
import { DBUserInfo } from "../db/DBUserDef";
import { LOBBY_USE_HTTP } from "../shared/configs/Constants";

export class WebsocketGameServer {
    public server!: WsServer<ServiceType_Public>;
    public logger!: Logger;

    /**
     * @en if this flag is true, the system won't create new room and match users for this RoomServer (still could join in by roomId).
     * @zh 如果此标记为 true, 则此 RoomServer 会再创建新的房间和匹配新的玩家（依然可以通过房间号进入）。
     */
    disabled: boolean = false;
    userNum: number = 0;
    userId2Conn = new Map<string, GameClientConn>();

    private addAnonymousConn(conn: GameClientConn) {
        conn.lastTickTime = Date.now();
        this.userId2Conn.set(`_anony_${conn.id}`, conn);
    }

    private removeAnonyousCoon(conn: GameClientConn) {
        this.userId2Conn.delete(`_anony_${conn.id}`);
    }

    authed(conn: GameClientConn) {
        this.userId2Conn.set(conn.uid!, conn);
        this.removeAnonyousCoon(conn);
    }

    async init(port: number) {
        this.server = new WsServer(serviceProto_Public, {
            port: port,
            // Remove this to use binary mode (remove from the client too)
            //json: true,
            logMsg: false
        });

        this.logger = this.server.logger;

        this.server.flows.postConnectFlow.push(call => {
            this.addAnonymousConn(call as GameClientConn);
            this.userNum++;
            return call;
        });

        const servicesMap = ServerGlobals.options.servicesMap;
        this.server.flows.preApiCallFlow.push(call => {
            let conn = call.conn as GameClientConn;
            //@en login related API only can be called by HTTP
            //@zh 登录相关只能走 HTTP 服务
            let err = '';
            if (call.service.name?.indexOf('login/') == 0) {
                err = 'INVALID_CALL';
            }
            else if (call.service.name?.indexOf('lobby/') == 0) {
                //@en if lobby use HTTP service, or this process has no lobby service, kick the user
                //@zh 如果大厅使用HTTP服务，或者本进程没有大厅服务，则踢掉用户
                if (LOBBY_USE_HTTP || !servicesMap['lobby']) {
                    err = 'INVALID_CALL';
                }
            }
            else {
                //@en check whether user permission is valid
                //@zh 检查用户权限是否合法
                let validErr = this.checkValid(call.service.name, call.conn)
                if (validErr) {
                    err = validErr;
                }
            }
            if(err){
                call.error(err);
                this.kickUser(conn,err);
                return;
            }
            return call;
        });

        this.server.flows.preMsgCallFlow.push(call => {
            //@en check whether user permission is valid
            //@zh 检查用户权限是否合法
            let err = this.checkValid(call.service.name, call.conn)
            if (err) {
                this.kickUser(call.conn as GameClientConn, err);
                return;
            }
            return call;
        });

        this.server.flows.postDisconnectFlow.push(v => {
            let conn = v.conn as GameClientConn;
            this.userNum--;
            return v;
        });

        this.server.listenMsg("Ping", call => {
            (call.conn as GameClientConn).lastTickTime = Date.now();
            call.conn.sendMsg("Pong", { timestamp: call.msg.timestamp });
        });

        //@en check connection alive every 3 seconds
        //@zh 每3秒检测一次链接活跃度
        setInterval(() => {
            this.checkConnectionState();
        }, 3000);

        await this.server.autoImplementApi(path.resolve(__dirname, '../apiPublic'));
    }

    checkValid(callName: string, conn: BaseConnection<any>) {
        if (callName != 'Ping' && callName != 'game/AuthClient') {
            if (!(conn as GameClientConn).uid) {
                return 'not_login'
            }
        }
    }

    async start() {
        if (!this.server) {
            return;
        }
        await this.server.start();
        this.logger.warn(chalk.green(`[Public] Websocket Service started at ${this.server.options.port}`));
    }

    async checkConnectionState() {
        this.userId2Conn.forEach(async conn => {
            let tickTimeout = ServerGlobals.connectionTickTimeout || 30000;
            if (Date.now() - conn.lastTickTime > tickTimeout) {
                await this.kickUser(conn, 'tick_timeout');
            }
        });
    }

    async kickUserById(uid: string, reason: string) {
        let conn = this.userId2Conn.get(uid);
        await this.kickUser(conn, reason);
    }

    async kickUser(conn: GameClientConn | undefined, reason: string) {
        if (conn) {
            conn.close(reason);
            if (conn.uid) {
                this.userId2Conn.delete(conn.uid);
            }

            // 退出已加入的子世界
            if (conn.curRoom) {
                conn.curRoom.onDisconnected(conn);
            }
            conn.uid = undefined;

            this.removeAnonyousCoon(conn);
        }
    }
}


export type GameClientConn = (WsConnection<ServiceType_Public>) & {
    token: string | undefined;
    uid: string | undefined;
    dbUserInfo: DBUserInfo | undefined;
    curRoom: Room | undefined;
    state: '' | 'login' | 'ready';
    lastTickTime: number;
};

export const websocketPublicServer = new WebsocketGameServer();