import { BaseRequest, BaseResponse, BaseConf } from "../../shared/protocols/base"

export interface ReqCreateRoomOnMinLoadServer extends BaseRequest {
    uid:string,
    roomName: string,
    gameType:string,
    password:string,
}

export interface ResCreateRoomOnMinLoadServer extends BaseResponse {
    serverUrl: string,
    roomId: string
}

export const conf: BaseConf = {
    
}