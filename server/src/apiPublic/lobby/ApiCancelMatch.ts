import { ApiCall } from "tsrpc";
import { ReqCancelMatch, ResCancelMatch } from "../../shared/protocols/public/lobby/PtlCancelMatch";
import { GameClientConn } from "../../common/WebsocketGameServer";
import { MatchSrvRPC } from "../../SrvMatch/MatchSrvRPC";

export async function ApiCancelMatch(call: ApiCall<ReqCancelMatch, ResCancelMatch>) {
    let conn = call.conn as GameClientConn;
    let ret = await MatchSrvRPC.get().cancelMatch(conn.uid!);
    if(ret.isSucc){
        call.succ(ret.res);
    }
    else{
        call.error(ret.err);
    }
}