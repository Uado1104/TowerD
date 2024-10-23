import { WECHAT } from 'cc/env';
import { ApiReturn, HttpClientTransportOptions, HttpClient as HttpClient_Browser, TsrpcError, WsClient as WsClient_Browser } from 'tsrpc-browser';
import { HttpClient as HttpClient_Miniapp, WsClient as WsClient_Miniapp } from 'tsrpc-miniapp';
import { ServiceType, serviceProto } from '../shared/protocols/serviceProto_public';
import { assetManager, TextAsset } from 'cc';
import { GameServerListFileURL, GameServerURLs } from './FrontConfig';

/** 网络请求相关 */
export class NetUtil {
    static createHttpClient(serverUrl): HttpClient_Browser<ServiceType> | HttpClient_Miniapp<ServiceType> {
        return new (WECHAT ? HttpClient_Miniapp : HttpClient_Browser)(serviceProto, {
            server: serverUrl,
            // json: true,
            logger: console
        });
    }

    /** World Server */
    static createWebsocketClient(serverUrl: string): WsClient_Browser<ServiceType> | WsClient_Miniapp<ServiceType> {
        let client = new (WECHAT ? WsClient_Miniapp : WsClient_Browser)(serviceProto, {
            server: serverUrl,
            heartbeat: {
                interval: 5000,
                timeout: 5000
            },
            // json: true,
            logger: console,
            logMsg: false
        });

        // FLOWS
        // TODO

        return client;
    }

    public static async getGameServerList(): Promise<Readonly<string[]>> {
        /**
         * @en if defined, load server list from remote file.
         * @zh 如果配置了此值，则优先从此值加载
        */
        if (GameServerListFileURL) {
            return new Promise((resolve, reject) => {
                assetManager.loadRemote(GameServerListFileURL, TextAsset, (err, textAsset: TextAsset) => {
                    let serverUrls = GameServerURLs;
                    try {
                        serverUrls = JSON.parse(textAsset.text);
                    } catch (error) {

                    }
                    resolve(serverUrls);
                });
            });
        }
        return GameServerURLs;
    }
}