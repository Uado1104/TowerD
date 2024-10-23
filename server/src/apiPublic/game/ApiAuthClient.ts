import { ApiCall } from "tsrpc";
import { ReqAuthClient, ResAuthClient } from "../../shared/protocols/public/game/PtlAuthClient";
import { TokenUtils } from "../../common/TokenUtils";
import { GameClientConn } from "../../common/WebsocketGameServer";
import { dbUser } from "../../db/DBMgr";
import { gameSrv } from "../../SrvGame/GameSrv";
import { ServerGlobals } from "../../common/ServerGloabls";

export async function ApiAuthClient(call: ApiCall<ReqAuthClient, ResAuthClient>) {
    if(!gameSrv.websocketServer){
        return;
    }

    let req = call.req;
    let serverToken = TokenUtils.genGameServerToken(req.uid, ServerGlobals.options.publicWsUrl, req.roomId, req.gameType, req.time);
    if (serverToken != req.sign) {
        return call.error('AUTH_FAILED');
    }


    let userInfo = await dbUser.getUserInfoByUid(req.uid);
    if(!userInfo){
        return call.error('USER_NOT_EXISTS');
    }
    
    let user = {
        name: userInfo?.name,
        visualId: userInfo?.visualId,
        uid: userInfo?.uid!,
        gender:userInfo?.gender,
    };

    let conn = call.conn as GameClientConn;
    conn.state = 'ready';
    conn.uid = req.uid;
    conn.dbUserInfo = userInfo;

    gameSrv.websocketServer.authed(conn);

    if(req.roomId && req.gameType && req.roleName){
        let err = await gameSrv.tryEnterRoom(conn, req.roomId, req.gameType,user);
        if (err) {
            return call.error(err.message, err.info);
        }

        let room = gameSrv.allRoomsMap.get(req.roomId);
        if(!room){
            return call.error('ROOM_NOT_EXIST');
        }

        let err2 = room.onRPC_JoinGame(req.uid,req.roleName!);
        if(err2){
            return call.error(err2);
        }
    }
    
    call.succ({ user: user });
}