import { ApiCall } from "tsrpc";
import { ReqUpdateUserLocation, ResUpdateUserLocation } from "../../privateProtocols/master/PtlUpdateUserLocation";
import { masterSrv } from "../../SrvMaster/MasterSrv";

export async function ApiUpdateUserLocation(call: ApiCall<ReqUpdateUserLocation, ResUpdateUserLocation>) {
    masterSrv.updateUserLocation(call.req.uids, call.req.serverUrl,call.req.roomId,call.req.gameType);
    call.succ({});
}