import { BaseRequest, BaseResponse, BaseConf } from "../../shared/protocols/base";
import { IRoomUpdateState } from "../game/RoomStateDef";

export interface ReqUpdateRoomState extends BaseRequest {
    internalUrl:string,
    instanceId:number,
    updateRooms:IRoomUpdateState[],
    deleteRooms:string[]
}

export interface ResUpdateRoomState extends BaseResponse {
    
}

export const conf: BaseConf = {
    
}