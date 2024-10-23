import { BaseRequest, BaseResponse, BaseConf } from "../../shared/protocols/base";
import { IRoomFullState } from "../game/RoomStateDef";

export interface ReqGetRoomServerState extends BaseRequest {
    roomId:string,    
}

export interface ResGetRoomServerState extends BaseResponse {
    state:IRoomFullState|undefined,
}

export const conf: BaseConf = {
    
}