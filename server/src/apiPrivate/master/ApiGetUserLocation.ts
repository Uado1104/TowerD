import { ApiCall } from "tsrpc";
import { ReqGetUserLocation, ResGetUserLocation } from "../../privateProtocols/master/PtlGetUserLocation";
import { masterSrv } from "../../SrvMaster/MasterSrv";

export async function ApiGetUserLocation(call: ApiCall<ReqGetUserLocation, ResGetUserLocation>) {
    let ret = masterSrv.getUserLocation(call.req.uid);
    call.succ(ret);
}