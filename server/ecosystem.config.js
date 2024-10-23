/**
 * @en this file is used for pm2 deploy, and also for server cluster config.
 * @zh 此文件既用于 pm2 部署，也用于服务器集群配置。
 */

module.exports = {
  globalVars: {
    /**
     * @en tick timeout of the connection, in ms.
     * @zh 连接超时时间，单位毫秒。
    */
    connectionTickTimeout: 30000,
    /**
     * @en key usd for token signature verification
     * @zh TOKEN 签名验证密钥
    */
    secretKey: 'do not forget to change this',

    /**
     * @en the database type, default is kvdb
     * @zh 数据库类型 //kvdb 或者 mongodb，默认使用 kvdb
    */
    dbType: 'kvdb',
    /**
     * @en mongodb config, if dbType is kvdb, then ignore
     * @zh mongodb 配置,如果 dbType 为 kvdb,则忽略
    */
    mongodb: {
      usr: '',
      pwd: '',
      host: '127.0.0.1',
      port: 27017,
      db: 'tgx-games',
    }
  },
  apps: [
    {
      name: 'game-server-1',
      script: 'ServerApp.js',
      env: {
        /**
         * @en IP address that the server listens to.
         * @zh 服务端监听的 IP
        */
        ip: '127.0.0.1',

        /**
         * @en public port for lobby service, make sure the remote can access. if not configured then this process will not open public HTTP service.
         * @zh HTTP 外网端口，需要确保远程能够访问。如果不配置，表示此进程不开启 HTTP 外网服务。
        */
        publicHttpPort: 3001,

        /**
         * @en public port for game service, make sure the remote can access. if not configured then this process will not open public Websocket service.
         * @zh 游戏房间服外网端口，需要确保远程能够访问。如果不配置，表示此进程不开启 Websocket 外网服务
        */
        publicWsPort: 4001,

        /**
         * @en URL address for external network, used for client connection. 
         * When domain name and reverse proxy forwarding are configured, this item needs to be configured.
         * When gamePort not configured then this item will be ignored.
         * @zh 游戏服外网 URL 地址，当配置了域名和反向代理转发时，需要配置此项。当 publicHttpPort 为空时，此项被忽略
        */
        //publicHttpUrl: 'http://域名或者外网IP:publicHttpPort',   //如 http://game.opentgx.com:3001

        /**
         * @en URL address for external network, used for client connection. 
         * When domain name and reverse proxy forwarding are configured, this item needs to be configured.
         * When gamePort not configured then this item will be ignored.
         * @zh 游戏服外网 URL 地址，当配置了域名和反向代理转发时，需要配置此项。当 publicWsPort 为空时，此项被忽略
        */
        //publicWsUrl: 'ws://域名或者外网IP:publicWsPort',   //如 ws://game.opentgx.com:4001

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
        services: 'master,match,login,lobby,game',

        /**
         * @en the game types supported by this process, use comma for multiple gameTypes.
         * when gameTypes is empty or services not contain 'game' then this process will not open game service.
         * @zh 此进程支持的游戏类型，多个游戏类型用逗号分割, 
         * 当 gameTypes 为空或者 services 不含 game 时，都表示不开启游戏服务。
        */
        gameTypes: 'normal',

        /**
         * @en the max room number that this process can be created.
         * When gamePort not configured then this item will be ignored.
         * @zh 本进程可创建的最大房间数量, 当 maxRoomNum 为 0 时，表示不开启房间服务
        */
        maxRoomNum: 1000,

        /**
         * @en internal port, used for internal service communication. Do not expose to the outside.
         * @zh 内网端口，用于内网通信服务。不要对外暴露。
        */
        internalPort: 40000,
      }
    },
    {
      name: 'game-server-2',
      script: 'ServerApp.js',
      env: {
        ip: '127.0.0.1',
        publicHttpPort:3002,
        publicWsPort: 4002,
        //publicHttpUrl: 'http://域名或者外网IP:3002',
        //publicWsUrl: 'ws://域名或者外网IP:4002',
        gameTypes: 'normal',
        maxRoomNum: 1000,
        services: 'lobby',
        internalPort: 40001,
      }
    },
  ]
};