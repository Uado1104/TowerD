import { BaseConf, BaseRequest, BaseResponse } from "../../base";

export interface ReqSendChat extends BaseRequest {
    /***
     * @en whether to notify all users.
     * @zh 是否是全局聊天
    */
    channel?:string
    content: string
}

export interface ResSendChat extends BaseResponse {

}

export const conf: BaseConf = {

}