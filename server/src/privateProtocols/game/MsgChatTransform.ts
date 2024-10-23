import { UserInfo } from "../../shared/types/UserInfo";

export interface MsgChatTransform {
    time: Date,
    user: UserInfo,
    channel?:string,
    content: string
}
