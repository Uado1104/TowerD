import { uint } from "tsrpc-proto"
import { UserInfo } from "./UserInfo"

//public - 公共场景，仅存一份，不销毁
//private - 私有场景，由用户或者系统为专门的用途创建，会根据情况销毁
export type RoomType = 'public' | 'private';

export interface IUserData {
    uid: string,
    name:string,
    visualId:number,
    gender?:number,
    ready?: boolean,
    /**
     * @en users with playerId will play the game, or they will be spectator.
     * @zh 拥有玩家编号的用户，表示会参与对战，否则是观众。
     **/
    playerId?: number,
    isOnline?:boolean,
}

export interface IRoomData {
    /**房间ID*/
    id: string,

    displayId: string,

    gameType:string,
    
    /**房间名称，仅用于显示*/
    name: string,
    /**最大用户数量，不同玩法数量不同*/
    maxUser: uint,
    /**用户列表*/
    userList: IUserData[],

    /**
     * @en the number of users can battle together 
     * @zh 可以一起参与对战的最大用户数量
     **/
    maxPlayerNum: number,

    /**
     * @en the current number of users that can battle together 
     * @zh 当前玩家数量
     **/
    playerNum: number,

    /***
     * 
     * 
    */
    isPlaying: boolean,

    /** 历史消息（只保留最近的 N 条） */
    messages: {
        channel?: string,
        user: UserInfo,
        time: Date,
        content: string
    }[]
}