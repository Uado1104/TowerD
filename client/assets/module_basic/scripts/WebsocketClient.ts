import { ApiReturn, TsrpcError, WsClient } from "tsrpc-browser";
import { ServiceType } from "../shared/protocols/serviceProto_public";
import { NetUtil } from "./NetUtil";
import { MsgPong } from "../shared/protocols/public/MsgPong";

export class WebsocketClient {
    public static EVENT_DISCONNECTED = 'WebsocketClient.EVENT_DISCONNECTED';
    protected _conn: WsClient<ServiceType> = null;
    protected _serverUrl = '';
    protected _eventHandlers: { [key: string]: { event: string, func: Function, thisArg: any }[] } = {};

    protected _handlers: { msg: string, func: Function, handler: Function, thisArg: any }[] = [];

    public get conn(): WsClient<ServiceType> {
        return this._conn;
    }

    private _latencyCache = [];
    private _sortedLatencyCache = [];
    private _beginLatencyIndex = 0;
    // latency in ms
    protected _latency = 0;
    public get latency() {
        return this._latency;
    }

    private _lastDisconnectReason: { code?: number, reason?: string } | undefined;
    public get lastDisconnectReason() {
        return this._lastDisconnectReason;
    }

    public get type() {
        return 'websocket';
    }

    constructor() {
        this.listenMsg("Pong", (msg: MsgPong) => {
            let len = this._latencyCache.length;
            let latency = Math.ceil((Date.now() - msg.timestamp) / 2);
            if (this._latencyCache.length == 12) {
                this._latencyCache[this._beginLatencyIndex] = latency;
                this._beginLatencyIndex = (this._beginLatencyIndex++) % 12;
            }
            else {
                this._latencyCache.push(latency);
            }

            if (len < 3) {
                this._latencyCache.push(latency);
                this._latency = latency;
            }
            else {
                let totalLatency = 0;
                this._sortedLatencyCache.length = 0;
                this._sortedLatencyCache.push(...this._latencyCache);
                this._sortedLatencyCache.sort((a, b) => a - b);
                //去除头尾（最高和最低，消除振荡）
                for (let i = 1; i < this._sortedLatencyCache.length - 1; ++i) {
                    totalLatency += this._sortedLatencyCache[i];
                }
                this._latency = Math.ceil(totalLatency / (this._sortedLatencyCache.length - 2));
            }
        });
    }

    get isConnected() {
        if (!this._conn) {
            return false;
        }
        return this._conn.isConnected;
    }

    createConnection(serverUrls: Readonly<string[]>) {
        if (this._conn) {
            this._conn.disconnect(1000, 'switch_server');
        }
        let index = Math.floor(serverUrls.length * Math.random());
        let serverUrl = serverUrls[index];
        this._serverUrl = serverUrl;
        this._conn = NetUtil.createWebsocketClient(this._serverUrl);

        this._conn.flows.postDisconnectFlow.push(v => {
            this._lastDisconnectReason = v;
            //this._dispatchEvent(WebsocketClient.EVENT_DISCONNECTED, [v,this]);
            return v;
        });

        /*
        //for message debug.
        this._conn.flows.preRecvMsgFlow.push( v => {
            if(v.msgName.indexOf("game/") != 0){
                console.log(v);   
            }
            return v;
        });
        */


        for (let i = 0; i < this._handlers.length; ++i) {
            this._conn.listenMsg(this._handlers[i].msg as any, this._handlers[i].handler as any);
        }

        this.startPing();
    }

    on(event: string, func: Function, thisArg?: any) {
        let handler = func;
        if (thisArg) {
            handler = func.bind(thisArg);
        }
        let handlers = this._eventHandlers[event] || [];
        handlers.push({ event: event, func: func, thisArg: thisArg });
        this._eventHandlers[event] = handlers;
    }

    off(event: string, func?: Function, thisArg?: any) {
        let handlers = this._eventHandlers[event];
        if (handlers) {
            for (let i = 0; i < handlers.length; ++i) {
                let item = handlers[i];
                if (item.func === func && item.thisArg == thisArg) {
                    handlers.splice(i, 1);
                    return;
                }
            }
        }
    }

    private _dispatchEvent(event: string, args) {
        let handlers = this._eventHandlers[event];
        if (handlers) {
            for (let i = 0; i < handlers.length; ++i) {
                let item = handlers[i];
                item.func.apply(item.thisArg, args);
            }
        }
    }

    private _internal = -1;
    startPing() {
        clearInterval(this._internal);
        this._internal = setInterval(() => {
            if (this._conn.isConnected) {
                //console.log('ping');
                this.sendMsg('Ping', { timestamp: Date.now() });
            }
        }, 5000);
    }

    public get serverUrl(): string {
        return this._serverUrl;
    }

    public listenMsg<T extends keyof ServiceType['msg']>(msgName: T | RegExp, func: Function, thisArg?: any) {
        let handler = func;
        if (thisArg) {
            handler = func.bind(thisArg);
        }
        this._handlers.push({ msg: msgName as string, func: func, handler: handler, thisArg: thisArg });
        this._conn?.listenMsg(msgName, handler as any);
    }

    public unlistenMsg<T extends keyof ServiceType['msg']>(msgName: T | RegExp, func: Function, thisArg?: any) {
        for (let i = 0; i < this._handlers.length; ++i) {
            let item = this._handlers[i];
            if (item.msg === msgName && item.func === func || item.thisArg == thisArg) {
                this._handlers.splice(i, 1);
                this._conn?.unlistenMsg(msgName, item.handler);
                return;
            }
        }
    }

    public unlistenMsgAll<T extends keyof ServiceType['msg']>(msgName: T | RegExp): void {
        for (let i = this._handlers.length - 1; i >= 0; --i) {
            let item = this._handlers[i];
            if (item.msg === msgName) {
                this._handlers.splice(i, 1);
            }
        }
        this._conn?.unlistenMsgAll(msgName);
    }

    public callApi<T extends string & keyof ServiceType['api']>(apiName: T, req: ServiceType['api'][T]['req'], options?: any): Promise<ApiReturn<ServiceType['api'][T]['res']>> {
        return this._conn?.callApi(apiName, req, options);
    }

    public sendMsg<T extends string & keyof ServiceType['msg']>(msgName: T, msg: ServiceType['msg'][T], options?: { timeout?: number, abortKey?: string }): Promise<{
        isSucc: true;
    } | {
        isSucc: false;
        err: TsrpcError;
    }> {
        if (this._conn?.isConnected) {
            return this._conn?.sendMsg(msgName, msg, options);
        }
    }

    public async ensureConnected() {
        let ret = await this._connect();
        return ret;
    }

    disconnect(code?: number, reason?: string) {
        this._lastDisconnectReason = { code, reason };
        this._conn?.disconnect(code, reason);
        clearInterval(this._internal);
        this._internal = - 1;
    }

    private async _connect(): Promise<{ isSucc: boolean, err?: { code?: string, message: string } }> {
        // Connect
        let resConnect = await this._conn?.connect();
        if (!resConnect.isSucc) {
            return { isSucc: false, err: { message: resConnect.errMsg } };
        }

        return { isSucc: true };
    }
}