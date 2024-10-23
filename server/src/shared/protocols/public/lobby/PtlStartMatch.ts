import { GameServerAuthParams } from "../../../types/GameServerAuthParams";

export interface ReqStartMatch {
    token?:string;
    type:string,
    immediate?:boolean
}

export interface ResStartMatch extends GameServerAuthParams {
}