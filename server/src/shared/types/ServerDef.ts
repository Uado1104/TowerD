export enum ServerType{
    Master = 0,
    Match = 1,
    Lobby = 2,
    Game = 3,
}
/**
 * @en server info, for cluster load balance and server list display
 * @zh 服务器信息，用于集群负载均衡，以及服务器列表显示
 */
export interface ServerState {
    /**
     * @en server type
     * @zh 服务器类型
     */
    type: number;

    interalUrl?:string;
    /**
     * @en server public url, for client connection
     * @zh 服务器对外 URL，用于客户端通信
     */
    publicUrl?: string;

    userNum?:number;
    roomNum?:number;
    updateTimeCost?:number,
    lastUpdateTime?:number;
}