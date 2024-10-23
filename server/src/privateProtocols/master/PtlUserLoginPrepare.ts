import { BaseRequest, BaseResponse, BaseConf } from "../../shared/protocols/base";

export interface ReqUserLoginPrepare extends BaseRequest {
    uid: string;
    serverUrl:string;
}

export interface ResUserLoginPrepare extends BaseResponse {
    
}

export const conf: BaseConf = {
    
}