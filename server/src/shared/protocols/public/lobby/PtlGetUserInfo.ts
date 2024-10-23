import { UserInfo } from "../../../types/UserInfo";

export interface ReqGetUserInfo {
    token?:string;
    uid?: string,
    uids?: string[],
}

export interface ResGetUserInfo {
    infos: UserInfo[]
}
