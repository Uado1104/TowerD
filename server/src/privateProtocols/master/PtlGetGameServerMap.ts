import { BaseRequest, BaseResponse, BaseConf } from "../../shared/protocols/base";
import { ServerState } from "../../shared/types/ServerDef";

export interface ReqGetGameServerMap extends BaseRequest {
    
}

export interface ResGetGameServerMap extends BaseResponse {
    serverMap:{ [key: string]: ServerState } 
}

export const conf: BaseConf = {
    
}