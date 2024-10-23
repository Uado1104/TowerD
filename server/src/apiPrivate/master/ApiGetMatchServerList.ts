import { ApiCall } from "tsrpc";
import { ReqGetMatchServerList, ResGetMatchServerList } from "../../privateProtocols/master/PtlGetMatchServerList";

export async function ApiGetMatchServerList(call: ApiCall<ReqGetMatchServerList, ResGetMatchServerList>) {
    // TODO
    call.error('API Not Implemented');
}