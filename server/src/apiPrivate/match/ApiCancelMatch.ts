import { ApiCall } from "tsrpc";
import { ReqCancelMatch, ResCancelMatch } from "../../privateProtocols/match/PtlCancelMatch";
import { matchSrv } from "../../SrvMatch/MatchSrv";

export async function ApiCancelMatch(call: ApiCall<ReqCancelMatch, ResCancelMatch>) {
    return await matchSrv.removeFromMatchQueue(call);
}