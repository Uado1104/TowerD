import { BaseRequest, BaseResponse, BaseConf } from "../../shared/protocols/base";
import { ServerState } from "../../shared/types/ServerDef";

export interface ReqGetLobbyServerList extends BaseRequest {
    
}

export interface ResGetLobbyServerList extends BaseResponse {
    serverList:ServerState[];     
}

export const conf: BaseConf = {
    
}