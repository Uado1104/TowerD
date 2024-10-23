import { UserInfo } from "../../../types/UserInfo";
import { BaseRequest, BaseResponse, BaseConf } from "../../base";

export interface ReqAuthClient extends BaseRequest {
    sign:string,
    uid:string,
    time:number,
    roomId:string,
    gameType:string,
    roleName?:string,
}

export interface ResAuthClient extends BaseResponse {
    user: UserInfo,
}