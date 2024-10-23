import { ApiCall } from "tsrpc";
import { ReqUserLoginPrepare, ResUserLoginPrepare } from "../../privateProtocols/master/PtlUserLoginPrepare";
import { masterSrv } from "../../SrvMaster/MasterSrv";
import { GameSrvRPC } from "../../SrvGame/GameSrvRPC";

export async function ApiUserLoginPrepare(call: ApiCall<ReqUserLoginPrepare, ResUserLoginPrepare>) {
    let loc = masterSrv.userLocs[call.req.uid];
    if(!loc){
        return call.succ({});
    }

    let ret = await GameSrvRPC.get(loc.serverUrl).kickUser(call.req.uid,'login_to_other');
    if(ret.isSucc){
        return call.succ({});
    }

    return call.error(ret.err);
}