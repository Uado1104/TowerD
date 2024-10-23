import { BaseRequest, BaseResponse, BaseConf } from "../../shared/protocols/base";
import { IRoomFullState } from "../game/RoomStateDef";


export interface ReqGetRoomListByType extends BaseRequest {
    gameType:string,
}

export interface ResGetRoomListByType extends BaseResponse {
    roomList:IRoomFullState[],   
}

export const conf: BaseConf = {
    
}