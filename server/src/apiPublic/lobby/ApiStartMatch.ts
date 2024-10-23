import { ApiCall, ApiCallHttp } from "tsrpc";
import { ReqStartMatch, ResStartMatch } from "../../shared/protocols/public/lobby/PtlStartMatch";
import { MatchSrvRPC } from "../../SrvMatch/MatchSrvRPC";
import { GameClientConn } from "../../common/WebsocketGameServer";
import { MasterSrvRPC } from "../../SrvMaster/MasterSrvRPC";

export async function ApiStartMatch(call: ApiCall<ReqStartMatch, ResStartMatch>) {
    let conn = call.conn as GameClientConn;
    let loc = await MasterSrvRPC.get().getUserLocation(conn.uid!);
    if(loc.isSucc && loc.res.roomId && loc.res.gameType){
        return call.error('IS_IN_GAME');
    }
    let ret = await MatchSrvRPC.get().addToMatchQueue(conn.uid!, call.req.type, call.req.immediate);
    if (ret.isSucc) {
        call.succ(ret.res);
    }
    else {
        call.error(ret.err);
    }
}