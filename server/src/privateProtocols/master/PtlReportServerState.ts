import { BaseRequest, BaseResponse, BaseConf } from "../../shared/protocols/base";
import { ServerState } from "../../shared/types/ServerDef";


export interface ReqReportServerState extends BaseRequest {
    state:ServerState;
}

export interface ResReportServerState extends BaseResponse {
    
}

export const conf: BaseConf = {
    
}