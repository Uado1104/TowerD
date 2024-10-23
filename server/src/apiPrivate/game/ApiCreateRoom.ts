import { ApiCall } from "tsrpc";
import { ReqCreateRoom, ResCreateRoom } from "../../privateProtocols/game/PtlCreateRoom";
import { gameSrv } from "../../SrvGame/GameSrv";

export async function ApiCreateRoom(call: ApiCall<ReqCreateRoom, ResCreateRoom>) {
    let room = gameSrv.createRoom(call.req.roomId, call.req.displayId, call.req.roomName, call.req.gameType, call.req.password);

    if (!room) {
        return call.error('INVALID_CONFIG_ID');
    }
    
    call.succ({
        state:room.state
    });
}