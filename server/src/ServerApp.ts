import fs from 'fs';
import { v4 } from 'uuid';

import { gameSrv } from "./SrvGame/GameSrv";
import { masterSrv } from "./SrvMaster/MasterSrv";
import { httpPublicServer, internalRPCHttpService } from "./common/HttpGameServer";
import { ServerArgs } from "./common/ServerArgs";
import { ServerGlobals } from './common/ServerGloabls';
import { NetworkUtil } from './common/NetworkUtil';
import { matchSrv } from './SrvMatch/MatchSrv';
import { mongodbMain } from './db/mongodb/MongoDBMain';
import { lobbySrv } from './SrvLobby/LobbySrv';
import { websocketPublicServer } from './common/WebsocketGameServer';
import { LOBBY_USE_HTTP } from './shared/configs/Constants';
import { dbInitialize } from './db/DBMgr';

interface ProcessEnv {
    ip: string,
    publicHttpPort: string,
    publicWsPort: string,
    publicHttpUrl: string,
    publicWsUrl: string,
    gameTypes: string,
    maxRoomNum: string,
    services: string,
    internalPort: string,
}

export class ServerApp {
    static async initConfigs() {
        let config: any = null;
        try {
            config = require('./ecosystem.config.js');
        } catch (e) {
            config = require('../ecosystem.config.js');
        }

        let masterCount = 0;
        let matchCount = 0;
        for (let i = 0; i < config.apps.length; ++i) {
            let env = config.apps[i].env as any as ProcessEnv;
            let ip = env.ip || NetworkUtil.getLocalIPv4();

            if (!ServerGlobals.masterUrl && env.services.indexOf('master') != -1) {
                masterCount++;
                ServerGlobals.masterUrl = `http://${ip}:${env.internalPort}`;;
            }
            if (!ServerGlobals.matchUrl && env.services.indexOf('match') != -1) {
                matchCount++;
                ServerGlobals.matchUrl = `http://${ip}:${env.internalPort}`;;
            }
        }

        if (masterCount != 1) {
            throw Error('Master Service can be only one in server cluster');
        }

        if (matchCount != 1) {
            throw Error('Match Service can be only one in server cluster');
        }

        ServerGlobals.connectionTickTimeout = config.globalVars.connectionTickTimeout;
        ServerGlobals.secretKey = config.globalVars.secretKey;
        ServerGlobals.dbType = config.globalVars.dbType;
        ServerGlobals.mongodb = config.globalVars.mongodb;
    }
    static initPublicHttpSecurity() {
        const serverMap = ServerGlobals.options.servicesMap;

        httpPublicServer.server.flows.preApiCallFlow.push(async call => {

            if (call.service.name?.indexOf('login/') === 0) {
                //@en check if this process has enabled login service
                //@zh 检查是否本进程拥有 login 服务
                if(!serverMap['login']){
                    call.error('UNKNOWN_ERROR');
                    return;
                }
            }
            else if(call.service.name?.indexOf('lobby/') === 0){
                //@en check if this process has enabled lobby service
                //@zh 检查是否本进程拥有 lobby 服务
                if(!serverMap['lobby']){
                    call.error('UNKNOWN_ERROR');
                    return;
                }

                //@en all lobby API calls are required to verify token
                //@zh 所有 lobby API 调用，都需要验证 token
                if (!call.req.token) {
                    call.error('INVALID_TOKEN');
                    return;
                }
            }
            else{
                //@en the rest protocols are only allowed to go through websocket
                //@zh 其他协议，只能走 websocket。
                call.error('UNKNOWN_ERROR');
            }
            return call;
        });
    }
    static async main() {

        ServerGlobals.uuid = v4();
        this.initConfigs();
        dbInitialize();

        //从 process.env 中读取配置
        let args: ServerArgs = {} as any;
        let env = process.env as any as ProcessEnv;
        args.ip = env.ip;
        args.publicHttpPort = Number(env.publicHttpPort || 0);
        args.publicWsPort = Number(env.publicWsPort || 0);
        args.gameTypesMap = {};
        args.gameTypes = [];
        if (env.gameTypes) {
            let arr = env.gameTypes.split(',');
            args.gameTypes = arr;
            arr.forEach(v => {
                args.gameTypesMap[v] = true;
            });
        }

        args.maxRoomNum = Number(env.maxRoomNum || 0);
        args.internalPort = Number(process.env.internalPort || 0);
        args.servicesMap = {};
        args.services = [];
        if (env.services) {
            let arr = env.services.split(',');
            args.services = arr;
            arr.forEach(v => {
                args.servicesMap[v] = true;
            });
        }

        args.publicHttpUrl = env.publicHttpUrl || `http://${NetworkUtil.getLocalIPv4()}:${env.publicHttpPort}`;
        args.publicWsUrl = env.publicWsUrl || `ws://${NetworkUtil.getLocalIPv4()}:${env.publicWsPort}`;
        args.internalUrl = `http://${args.ip}:${args.internalPort}`;

        ServerGlobals.options = args;

        console.log('=============Server App================');
        console.log(ServerGlobals);
        console.log('=============Server App================');
        // RPC HTTP 服务
        await internalRPCHttpService.init(args.internalPort, '../apiPrivate');

        if (args.publicHttpPort) {
            httpPublicServer.init(args.publicHttpPort, '../apiPublic');
            this.initPublicHttpSecurity();
        }

        if (args.publicWsPort) {
            websocketPublicServer.init(args.publicWsPort);
        }

        //======初始化相关服务=====
        await masterSrv.init();
        await matchSrv.init();
        await lobbySrv.init();
        await gameSrv.init();

        //=====启动服务====

        await internalRPCHttpService.start();
        if (ServerGlobals.dbType == 'mongodb') {
            mongodbMain.start();
        }

        await masterSrv.start();
        await matchSrv.start();
        await lobbySrv.start();
        await gameSrv.start();

        if (args.publicHttpPort) {
            httpPublicServer.start();
        }
        
        if (args.publicWsPort) {
            websocketPublicServer.start();
        }
    }
};

if (process.env.internalPort) {
    ServerApp.main();
}

let printMemUsage = false;
if (printMemUsage) {
    let memoryUsageMin: NodeJS.MemoryUsage = { arrayBuffers: Number.MAX_VALUE, external: Number.MAX_VALUE, heapTotal: Number.MAX_VALUE, heapUsed: Number.MAX_VALUE, rss: Number.MAX_VALUE };
    let memoryUsageMax: NodeJS.MemoryUsage = { arrayBuffers: 0, external: 0, heapTotal: 0, heapUsed: 0, rss: 0 };

    setInterval(() => {
        let usage = process.memoryUsage();

        memoryUsageMin.arrayBuffers = Math.min(memoryUsageMin.arrayBuffers, usage.arrayBuffers);
        memoryUsageMin.external = Math.min(memoryUsageMin.external, usage.external);
        memoryUsageMin.heapTotal = Math.min(memoryUsageMin.heapTotal, usage.heapTotal);
        memoryUsageMin.heapUsed = Math.min(memoryUsageMin.heapUsed, usage.heapUsed);
        memoryUsageMin.rss = Math.min(memoryUsageMin.rss, usage.rss);

        memoryUsageMax.arrayBuffers = Math.max(memoryUsageMax.arrayBuffers, usage.arrayBuffers);
        memoryUsageMax.external = Math.max(memoryUsageMax.external, usage.external);
        memoryUsageMax.heapTotal = Math.max(memoryUsageMax.heapTotal, usage.heapTotal);
        memoryUsageMax.heapUsed = Math.max(memoryUsageMax.heapUsed, usage.heapUsed);
        memoryUsageMax.rss = Math.max(memoryUsageMax.rss, usage.rss);

        console.log("==== Memory Usage====");
        console.log('ArrayBuffers', memoryUsageMin.arrayBuffers, memoryUsageMax.arrayBuffers, usage.arrayBuffers, usage.arrayBuffers - memoryUsageMin.arrayBuffers);
        console.log('External', memoryUsageMin.external, memoryUsageMax.external, usage.external, usage.external - memoryUsageMin.external);
        console.log('HeapTotal', memoryUsageMin.heapTotal, memoryUsageMax.heapTotal, usage.heapTotal, usage.heapTotal - memoryUsageMin.heapTotal);
        console.log('HeapUsed', memoryUsageMin.heapUsed, memoryUsageMax.heapUsed, usage.heapUsed, usage.heapUsed - memoryUsageMin.heapUsed);
        console.log('Rss', memoryUsageMin.rss, memoryUsageMax.rss, usage.rss, usage.rss - memoryUsageMin.rss);
        //console.log(process.cpuUsage(),process.memoryUsage());
    }, 10000);
}