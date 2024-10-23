import { uint } from "tsrpc";
import { IRoomServerInfo, IRoomFullState } from "./RoomStateDef";
import { BaseRequest, BaseResponse, BaseConf } from "../../shared/protocols/base";

/**
 * @en get all room states on this server, will be called by match server periodically
 * @zh 获取当前服务器上所有的房间状态，匹配服会按一定间隔调用
*/

export interface ReqGetRoomStates extends BaseRequest {
    
}

export interface ResGetRoomStates extends IRoomServerInfo {
}

export const conf: BaseConf = {
    
}