import { BaseRequest, BaseResponse, BaseConf } from "../../shared/protocols/base";

export interface ReqUpdateUserLocation extends BaseRequest {
    uids:string[],
    serverUrl?:string,
    roomId?:string,
    gameType?:string,
}

export interface ResUpdateUserLocation extends BaseResponse {
    
}

export const conf: BaseConf = {
    
}