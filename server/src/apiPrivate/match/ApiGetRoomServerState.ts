import { ApiCall } from "tsrpc";
import { ReqGetRoomServerState, ResGetRoomServerState } from "../../privateProtocols/match/PtlGetRoomServerState";
import { matchSrv } from "../../SrvMatch/MatchSrv";

export async function ApiGetRoomServerState(call: ApiCall<ReqGetRoomServerState, ResGetRoomServerState>) {
    let info = matchSrv.getRoomState(call.req.roomId);
    call.succ({
        state:info  
    });
}