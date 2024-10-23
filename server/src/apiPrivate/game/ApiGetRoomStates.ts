import { ApiCall } from "tsrpc";
import { gameSrv } from "../../SrvGame/GameSrv";
import { ReqGetRoomStates, ResGetRoomStates } from "../../privateProtocols/game/PtlGetRoomStates";

export async function ApiGetRoomStates(call: ApiCall<ReqGetRoomStates, ResGetRoomStates>) {
    let ret = gameSrv.getAllRoomStates();
    call.succ(ret);
}