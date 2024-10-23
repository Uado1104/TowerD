import { uint } from "tsrpc";
import { IUserData } from "../../../types/RoomData";

export interface MsgRoomDataChangedPush {
        name?: string,
        maxUser?: uint,
        userList?: IUserData[],
        maxPlayer?: number,
        numPlayer?: number,
        isPlaying?: boolean,
}
