import { ApiCall } from "tsrpc";
import { ReqReady, ResReady } from "../../shared/protocols/public/room/PtlReady";
import { Room } from "../../SrvGame/Room";
import { GameClientConn } from "../../common/WebsocketGameServer";

export async function ApiReady(call: ApiCall<ReqReady, ResReady>) {
    // TODO
    const conn = call.conn as GameClientConn;

    let current = conn.curRoom as Room;
    if(!current){
        return call.error('NO_TABLE');
    }

    current.onRPC_UserReady(call);
}