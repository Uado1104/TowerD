
/**
 * @en load server list from remote file, if configured, will use it first
 * @zh 从远程文件加载服务器列表，如果配置了值，则会优先使用
*/

import { LOBBY_USE_HTTP } from "../shared/configs/Constants";

/**
 * json file format example
 * json 文件格式示例
 * ["ws://127.0.0.1:3001", "ws://192.168.0.9"]
*/
export const GameServerListFileURL = '';//'http://192.168.0.104:7456/web-mobile/web-mobile/server-list.json';

/**
 * @en server list, randomly select one connection
 * @zh 服务器列表，随机选择一个连接
*/
export const GameServerURLs = [
    'http://127.0.0.1:3001',
];