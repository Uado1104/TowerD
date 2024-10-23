import { uint } from "tsrpc-proto";

export interface IRoomServerInfo {
    instanceId: number,
    internalUrl: string,
    publicUrl: string,
    maxRoomNum:number,
    rooms: IRoomFullState[],
    supportedGameTypes: string[],
    disabled?: boolean,
    lastUpdateTime?:number,
}

export interface IRoomFullState {
    id: string,
    displayId: string,
    gameType: string,
    name: string,
    userNum: uint,
    maxUserNum: uint,
    playerNum: uint,
    maxPlayerNum: uint,
    isPlaying: boolean,
    /** 为 undefined 代表不在匹配中 */
    startMatchTime?: uint,
    // 信息的最后更新时间
    updateTime: uint,
    //进入密码
    password?: string,
    serverInternalUrl?: string,
    serverPublicUrl?: string,
}

export interface IRoomUpdateState {
    id: string,
    isPlaying:boolean,
    userNum: uint,
    playerNum: uint,
}


// export const conf = {}