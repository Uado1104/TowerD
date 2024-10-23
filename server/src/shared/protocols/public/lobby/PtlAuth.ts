import { GameServerAuthParams } from "../../../types/GameServerAuthParams";
import { UserInfo } from "../../../types/UserInfo";

export interface ReqAuth{
    token:string,
    uid:string,
    time:number,
    sign:string,
}

export interface ResAuth {
    userInfo:UserInfo,
    roomId:string,
}