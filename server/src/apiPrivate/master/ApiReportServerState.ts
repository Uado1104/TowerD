import { ApiCall } from "tsrpc";
import { ReqReportServerState, ResReportServerState } from "../../privateProtocols/master/PtlReportServerState";
import { masterSrv } from "../../SrvMaster/MasterSrv";

export async function ApiReportServerState(call: ApiCall<ReqReportServerState, ResReportServerState>) {
    masterSrv.updateServerState(call.req.state);
    call.succ({});
}