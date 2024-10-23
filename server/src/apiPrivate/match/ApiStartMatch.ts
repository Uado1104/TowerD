import { ApiCall, ApiCallHttp } from "tsrpc";
import { ReqStartMatch, ResStartMatch } from "../../privateProtocols/match/PtlStartMatch";
import { matchSrv } from "../../SrvMatch/MatchSrv";

export async function ApiStartMatch(call: ApiCall<ReqStartMatch, ResStartMatch>) {
    return await matchSrv.addToMatchQueue(call);
}