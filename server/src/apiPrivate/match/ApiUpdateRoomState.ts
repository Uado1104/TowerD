import { ApiCall } from "tsrpc";
import { ReqUpdateRoomState, ResUpdateRoomState } from "../../privateProtocols/match/PtlUpdateRoomState";
import { matchSrv } from "../../SrvMatch/MatchSrv";

export default async function (call: ApiCall<ReqUpdateRoomState, ResUpdateRoomState>) {
    matchSrv.updateRoomStates(call.req);
    call.succ({});
}