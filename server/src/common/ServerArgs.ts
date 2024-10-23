export interface ServerArgs {
    /**
     * @en IP address that the server listens to.
     * @zh 服务端监听的 IP
    */
    ip: string,

    /**
     * @en public port for lobby service, make sure the remote can access. if not configured then this process will not open public HTTP service.
     * @zh HTTP 外网端口，需要确保远程能够访问。如果不配置，表示此进程不开启 HTTP 外网服务。
    */
    publicHttpPort: number,

    /**
     * @en public port for game service, make sure the remote can access. if not configured then this process will not open public Websocket service.
     * @zh 游戏房间服外网端口，需要确保远程能够访问。如果不配置，表示此进程不开启 Websocket 外网服务
    */
    publicWsPort: number,

    /**
     * @en URL address for external network, used for client connection. 
     * When domain name and reverse proxy forwarding are configured, this item needs to be configured.
     * When gamePort not configured then this item will be ignored.
     * @zh 游戏服外网 URL 地址，当配置了域名和反向代理转发时，需要配置此项。当 publicHttpPort 为空时，此项被忽略
    */
    publicHttpUrl: string,   //e.g. http://game.opentgx.com:3001

    /**
     * @en URL address for external network, used for client connection. 
     * When domain name and reverse proxy forwarding are configured, this item needs to be configured.
     * When gamePort not configured then this item will be ignored.
     * @zh 游戏服外网 URL 地址，当配置了域名和反向代理转发时，需要配置此项。当 publicWsPort 为空时，此项被忽略
    */
    publicWsUrl: string,   //e.g. ws://game.opentgx.com:4001

    /**
     * @en the services supported by this process. use comma for multiple services.
     * - master: internal service, manages the service processes, and can only have one in the cluster.
     * - match: internal service, manages the queue of players' competition requests, and can only have one in the cluster.
     * - login: public service, handle the user login,register
     * - lobby: public service, handle the user operation requests in the lobby.
     * - game: public service, handle the rooms and gameplay.
     * @zh 本进程开启的服务列表，master,match,login,lobby。多个服务之间用逗号分割
     * - master：内部服务，负责服务进程管理，整个集群只能开启一个
     * - match：内部服务，负责游戏匹配，整个集群只能开启一个
     * - login：公开服务，负责用户登录、注册、角色创建，可以开启多个
     * - lobby：公开服务，负责用户大厅相关的服务，可以开启多个
     * - game：公开服务，负责房间和游戏逻辑
    */
    servicesMap: { [key: string]: boolean },
    services: string[],

    /**
     * @en the game types supported by this process, 
     * when gameTypes is empty or services not contain 'game' then this process will not open game service.
     * @zh 此进程支持的游戏类型，
     * 当 gameTypes 为空或者 services 不含 game 时，都表示不开启游戏服务。
    */
    gameTypesMap: { [key: string]: boolean },
    gameTypes: string[],

    /**
     * @en the max room number that this process can be created.
     * When gamePort not configured then this item will be ignored.
     * @zh 本进程可创建的最大房间数量, 当 maxRoomNum 为 0 时，表示不开启房间服务
    */
    maxRoomNum: number,

    /**
     * @en internal port, used for internal service communication. Do not expose to the outside.
     * @zh 内网端口，用于内网通信服务。不要对外暴露。
    */
    internalPort: number,


    /**
     * @en internal url, used for internal service communication. Do not expose to the outside.
     * @zh 内网Url，用于内网通信服务。不要对外暴露。
    */
    internalUrl: string,
}