import http from 'http';
import https from 'https';
import { HttpClient } from "tsrpc";
import { serviceProto as serviceProto_Private, ServiceType as ServiceType_Private } from "../privateProtocols/serviceProto_private";
import { Agent } from "http";
export class HttpRPC {
    protected static _rpcs: { [key: string]: HttpRPC } = {};
    protected static getRPCClient(serverUrl: string, cls: any): HttpRPC {
        let key = serverUrl + cls.name;
        if (HttpRPC._rpcs[key] == null) {
            HttpRPC._rpcs[key] = new cls(serverUrl);
        }
        return HttpRPC._rpcs[key];
    }
    protected _httpClient = new HttpClient(serviceProto_Private, {
        server: this.serverUrl,
        agent: new (this.serverUrl.startsWith('https') ? https : http).Agent({ keepAlive: true }),
        logLevel: 'warn'
    });
    constructor(private serverUrl: string) {
    }

    public get httpClient() {
        return this._httpClient;
    }
}