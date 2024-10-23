import { BaseRequest, BaseResponse, BaseConf } from "../../shared/protocols/base";

/**
 * @en kick user
 * @zh 踢人
*/
export interface ReqKickUser extends BaseRequest {
    uid:string;
    reason:string;
}

export interface ResKickUser extends BaseResponse {
    
}

export const conf: BaseConf = {
    
}