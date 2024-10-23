import { BaseRequest, BaseResponse, BaseConf } from "../../shared/protocols/base";
import { ServerState } from "../../shared/types/ServerDef";

export interface ReqGetGameServerList extends BaseRequest {
    
}

export interface ResGetGameServerList extends BaseResponse {
    serverList:ServerState[];   
}

export const conf: BaseConf = {
    
}