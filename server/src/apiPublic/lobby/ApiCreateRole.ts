import { ApiCall } from "tsrpc";
import { ReqCreateRole, ResCreateRole } from "../../shared/protocols/public/lobby/PtlCreateRole";
import { GameClientConn } from "../../common/WebsocketGameServer";
import { dbUser } from "../../db/DBMgr";

export async function ApiCreateRole(call: ApiCall<ReqCreateRole, ResCreateRole>) {
    let conn = call.conn as GameClientConn;
    let req = call.req;
    await dbUser.updateUserInfo(conn, { name: req.name, visualId: req.visualId, coin: 0 });
    conn.dbUserInfo!.name = req.name;
    conn.dbUserInfo!.visualId = req.visualId;
    call.succ({ name: req.name, visualId: req.visualId });
}