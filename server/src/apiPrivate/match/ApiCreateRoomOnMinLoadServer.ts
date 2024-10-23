import { ApiCall } from "tsrpc";
import { ReqCreateRoomOnMinLoadServer, ResCreateRoomOnMinLoadServer } from "../../privateProtocols/match/PtlCreateRoomOnMinLoadServer";
import { matchSrv } from "../../SrvMatch/MatchSrv";

export async function ApiCreateRoomOnMinLoadServer(call: ApiCall<ReqCreateRoomOnMinLoadServer, ResCreateRoomOnMinLoadServer>) {
    let ret = await matchSrv.createRoom(call);
    if(ret.isSucc){
        call.succ(ret.res);
    }
    else{
        call.error(ret.err);
    }
}