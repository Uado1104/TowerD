import { GameServerAuthParams } from "../../../types/GameServerAuthParams";

export interface ReqTryEnterRoom {
    token?:string;
    /**
     * @en id and displayId both can be used
     * @zh 可以使用 id 和 displayId
    */
    id:string,
    password?:string,
}

export interface ResTryEnterRoom extends GameServerAuthParams {
}
