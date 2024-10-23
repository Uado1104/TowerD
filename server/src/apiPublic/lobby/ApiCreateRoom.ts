import { ApiCall } from "tsrpc";
import { ReqCreateRoom, ResCreateRoom } from "../../shared/protocols/public/lobby/PtlCreateRoom";
import { GameClientConn } from "../../common/WebsocketGameServer";
import { MatchSrvRPC } from "../../SrvMatch/MatchSrvRPC";
import { TokenUtils } from "../../common/TokenUtils";

export async function ApiCreateRoom(call: ApiCall<ReqCreateRoom, ResCreateRoom>) {
    // 参数校验
    if (!call.req.roomName) {
        return call.error('请输入一个名称');
    }

    let conn = call.conn as GameClientConn;

    let ret = await MatchSrvRPC.get().createRoomOnMinLoadServer(conn.uid!, call.req.roomName, call.req.gameType, call.req.password);

    if(ret.isSucc){
        let enterParams = TokenUtils.createEnterRoomParams(
            conn.uid!,
            ret.res.serverUrl,
            ret.res.roomId,
            call.req.gameType,
        );
        call.succ({enterRoomParams: enterParams});
    }
    else{
        call.error(ret.err);
    }
}