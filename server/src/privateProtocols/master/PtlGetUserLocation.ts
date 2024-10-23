import { BaseRequest, BaseResponse, BaseConf } from "../../shared/protocols/base";

export interface ReqGetUserLocation extends BaseRequest {
    uid:string,
}

export interface ResGetUserLocation extends BaseResponse {
    serverUrl?:string,
    roomId?:string,
    gameType?:string,
}

export const conf: BaseConf = {
    
}