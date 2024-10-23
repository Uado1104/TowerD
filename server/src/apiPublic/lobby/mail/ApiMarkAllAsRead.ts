import { ApiCall } from "tsrpc";
import { ReqMarkAllAsRead, ResMarkAllAsRead } from "../../../shared/protocols/public/lobby/mail/PtlMarkAllAsRead";
import { GameClientConn } from "../../../common/WebsocketGameServer";
import { dbMail, dbUser } from "../../../db/DBMgr";

export async function ApiMarkAllAsRead(call: ApiCall<ReqMarkAllAsRead, ResMarkAllAsRead>) {
    let req = call.req;
    let uid = (call.conn as GameClientConn).uid!;

    let dbData = await dbUser.getUserInfoByUid(uid);
    let mails = await dbMail.markAsReadMany(dbData?.mails || []);
    call.succ({mails:mails});
}