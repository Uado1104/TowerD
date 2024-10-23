import { ApiCall } from "tsrpc";
import { ReqKickUser, ResKickUser } from "../../privateProtocols/game/PtlKickUser";
import { gameSrv } from "../../SrvGame/GameSrv";

export async function ApiKickUser(call: ApiCall<ReqKickUser, ResKickUser>) {
    if(!call.req.uid){
        return call.error('uid is required');
    }

    if(!gameSrv.websocketServer){
        return;
    }

    let conn = gameSrv.websocketServer.userId2Conn.get(call.req.uid);
    if(conn){
        if(conn.state == 'ready'){
            await gameSrv.websocketServer.kickUserById(call.req.uid,call.req.reason);
            return call.succ({});
        }
        else{
            return call.error('user is not ready');
        }
    }
    call.succ({});
}