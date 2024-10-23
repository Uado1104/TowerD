import { ApiCall } from "tsrpc";
import { GameClientConn } from "../../common/WebsocketGameServer";
import { ReqExitRoom, ResExitRoom } from "../../shared/protocols/public/room/PtlExitRoom";

export async function ApiExitRoom(call: ApiCall<ReqExitRoom, ResExitRoom>) {
    const conn = call.conn as GameClientConn;

    if (conn.curRoom) {
        conn.curRoom.onRPC_Leave(conn);
        conn.curRoom = undefined;
    }

    call.succ({});
}