import { ApiCall } from "tsrpc";
import { ReqGetMails, ResGetMails } from "../../../shared/protocols/public/lobby/mail/PtlGetMails";
import { GameClientConn } from "../../../common/WebsocketGameServer";
import { dbMail, dbUser } from "../../../db/DBMgr";

export async function ApiGetMails(call: ApiCall<ReqGetMails, ResGetMails>) {
    let req = call.req;
    let uid = (call.conn as GameClientConn).uid;
    if(!uid){
        return call.error('NOT_LOGIN');
    }
    let dbData = await dbUser.getUserInfoByUid(uid);
    if(!dbData){
        return call.error('INVALID_UID');
    }
    call.succ({mails: await dbMail.getMailMany(dbData.mails) || []});
}