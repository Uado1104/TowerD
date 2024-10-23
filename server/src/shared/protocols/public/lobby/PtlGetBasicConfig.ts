import { BasicConfig } from "../../../configs/BasicConfig";
import { BaseRequest, BaseResponse, BaseConf } from "../../base";

export interface ReqGetBasicConfig extends BaseRequest {
    token?:string;   
}

export interface ResGetBasicConfig extends BasicConfig {
    
}

export const conf: BaseConf = {
    
}