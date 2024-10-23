import { ApiCall } from "tsrpc";
import { ReqSendChat, ResSendChat } from "../../shared/protocols/public/chat/PtlSendChat";
import { gameSrv } from "../../SrvGame/GameSrv";
import { GameClientConn } from "../../common/WebsocketGameServer";
import { GameSrvRPC } from "../../SrvGame/GameSrvRPC";
import { dbUser } from "../../db/DBMgr";

export async function ApiSendChat(call: ApiCall<ReqSendChat, ResSendChat>) {
    const conn = call.conn as GameClientConn;
    const uid = conn.uid;
    if (!uid) {
        return call.error('NOT_LOGIN');
    }

    const currentUser = await dbUser.getUserInfoByUid(uid);
    if(!currentUser){
        return call.error('INVALID_UID');
    }

    let msg = {
        time: new Date,
        channel: call.req.channel,
        content: call.req.content,
        user: {
            uid: uid,
            name: currentUser.name,
            gender: currentUser.gender,
        }
    };

    if (msg.channel) {
        GameSrvRPC.broadcastChatMsg(msg);
    }
    else if(conn.curRoom) {
        gameSrv.broadcastInRoom(conn.curRoom, msg);
    }

    call.succ({});
}