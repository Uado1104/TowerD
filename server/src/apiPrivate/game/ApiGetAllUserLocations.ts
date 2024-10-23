import { ApiCall } from "tsrpc";
import { ReqGetAllUserLocations, ResGetAllUserLocations } from "../../privateProtocols/game/PtlGetAllUserLocations";
import { gameSrv } from "../../SrvGame/GameSrv";

export async function ApiGetAllUserLocations(call: ApiCall<ReqGetAllUserLocations, ResGetAllUserLocations>) {
    let locs = gameSrv.getAllUserLocations();
    call.succ({
        locations:locs,
    })
}