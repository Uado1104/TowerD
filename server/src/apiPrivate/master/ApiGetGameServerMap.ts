import { ApiCall } from "tsrpc";
import { ReqGetGameServerMap, ResGetGameServerMap } from "../../privateProtocols/master/PtlGetGameServerMap";

export default async function (call: ApiCall<ReqGetGameServerMap, ResGetGameServerMap>) {
    // TODO
    call.error('API Not Implemented');
}