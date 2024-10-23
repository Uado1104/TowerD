import { ApiCall } from "tsrpc";
import { ReqClearAllMails, ResClearAllMails } from "../../../shared/protocols/public/lobby/mail/PtlClearAllMails";
import { GameClientConn } from "../../../common/WebsocketGameServer";
import { dbMail, dbUser } from "../../../db/DBMgr";

export async function ApiClearAllMails(call: ApiCall<ReqClearAllMails, ResClearAllMails>) {
    let req = call.req;
    let uid = (call.conn as GameClientConn).uid!;
    let dbData = await dbUser.getUserInfoByUid(uid);
    if (dbData && dbData.mails) {
        dbMail.deleteMailMany(dbData.mails);
        dbUser.updateUserInfoByUid(uid, { mails: [] });
    }
    call.succ({});
}