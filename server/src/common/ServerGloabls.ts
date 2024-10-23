import { ServerArgs } from "./ServerArgs";

export class ServerGlobals {
    /**
     * @en server instance unique ID, different every time it starts
     * @zh 服务器实例唯一ID，每次启动都会不一样
    */
    public static uuid:string;

    public static options: ServerArgs;
    /**
     * @en master service address
     * @zh master 服务地址
    */
    public static masterUrl: string = '';

    /**
     * @en math service address
     * @zh 匹配服务地址
    */
    public static matchUrl: string = '';

    /**
     * @en the database type, default is kvdb
     * @zh 数据库类型，默认使用 kvdb
    */
    public static dbType: 'kvdb' | 'mongodb' = 'kvdb';

    /**
     * @en tick timeout of the connection, in ms.
     * @zh 连接超时时间，单位毫秒。
    */
    public static connectionTickTimeout: number;
    /**
     * @en key usd for token signature verification
     * @zh TOKEN 签名验证密钥
    */
    public static secretKey: string = '';

    /**
     * @en mongodb config, if dbType is kvdb, then ignore
     * @zh mongodb 配置,如果 dbType 为 kvdb,则忽略
    */
    public static mongodb: {
        usr: string,
        pwd: string,
        host: string,
        port: number,
        db: string,
    };
}