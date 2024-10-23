import { GameServerAuthParams } from "../../../types/GameServerAuthParams";

export interface ReqCreateRoom {
    roomName: string,
    gameType:string,
    password:string,
}

export interface ResCreateRoom {
    enterRoomParams:GameServerAuthParams
}