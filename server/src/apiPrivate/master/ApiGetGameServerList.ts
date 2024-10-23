import { ApiCall } from "tsrpc";
import { ReqGetGameServerList, ResGetGameServerList } from "../../privateProtocols/master/PtlGetGameServerList";
import { masterSrv } from "../../SrvMaster/MasterSrv";

export async function ApiGetGameServerList(call: ApiCall<ReqGetGameServerList, ResGetGameServerList>) {
    call.succ({ serverList: masterSrv.gameServerList });
}