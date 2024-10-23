import { BaseConf } from "../../shared/protocols/base"
import { IRoomFullState } from "./RoomStateDef"

export interface ReqCreateRoom {
    roomId:string,
    displayId:string,
    roomName: string,
    gameType:string,
    password:string,
}

export interface ResCreateRoom {
    state:IRoomFullState
}

export const conf: BaseConf = {
    allowGuest: true
}