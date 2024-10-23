import chalk from "chalk";
import path from "path";
import { BaseConnection, HttpClient, HttpServer, Logger } from "tsrpc";
import { serviceProto as serviceProto_Private, ServiceType as ServiceType_Private } from "../privateProtocols/serviceProto_private";
import { serviceProto as serviceProto_Public, ServiceType as ServiceType_Public } from "../shared/protocols/serviceProto_public";
import { ServerArgs } from "../common/ServerArgs";
import { NetworkUtil } from "./NetworkUtil";
import { ServerGlobals } from "./ServerGloabls";

export type HttpServerConn = BaseConnection<ServiceType_Private>;

export class HttpGameServer {
    public server!: HttpServer<ServiceType_Private> | HttpServer<ServiceType_Public>;
    public logger!: Logger;
    private _serviceName: string = '';

    public get asPrivate():HttpServer<ServiceType_Private>{
        return this.server as HttpServer<ServiceType_Private>;
    }

    public get asPublic():HttpServer<ServiceType_Public>{
        return this.server as HttpServer<ServiceType_Public>;   
    }

    async init(port:number, autoImplementApi: '../apiPrivate' | '../apiPublic') {

        if (autoImplementApi == '../apiPrivate') {
            this.server = new HttpServer(serviceProto_Private, {
                port: port,
                keepAliveTimeout: 30000,
                logLevel: "warn",
                // Remove this to use binary mode (remove from the client too)
                //json: true
            });

            this._serviceName = '[Private] HTTP Service';
        }
        else {
            this.server = new HttpServer(serviceProto_Public, {
                port: port,
                keepAliveTimeout: 30000,
                logLevel: "warn",
                // Remove this to use binary mode (remove from the client too)
                //json: true
            });

            this._serviceName = '[Public] HTTP Service';
        }

        this.logger = this.server.logger;
        //useAdminToken(this.server);
        await this.server.autoImplementApi(path.resolve(__dirname, autoImplementApi));
    }

    async start() {
        if (!this.server) {
            return;
        }
        await this.server.start();
        this.logger.warn(chalk.greenBright(`${this._serviceName} started a ${this.server.options.port}`));

        // 定时 log 播报子世界状态
        setInterval(() => {
            this.update();
        }, 15000);
    }

    update() {
    }
}

export const internalRPCHttpService = new HttpGameServer();

export const httpPublicServer = new HttpGameServer();