import { GameServerAuthParams } from "../../shared/types/GameServerAuthParams";

export interface ReqStartMatch {
    uid:string,
    type:string,
    immediate?:boolean
}

export interface ResStartMatch extends GameServerAuthParams {
}