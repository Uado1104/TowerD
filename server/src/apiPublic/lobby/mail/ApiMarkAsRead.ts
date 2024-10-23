import { ApiCall } from "tsrpc";
import { ReqMarkAsRead, ResMarkAsRead } from "../../../shared/protocols/public/lobby/mail/PtlMarkAsRead";
import { GameClientConn } from "../../../common/WebsocketGameServer";
import { dbMail, dbUser } from "../../../db/DBMgr";

export async function ApiMarkAsRead(call: ApiCall<ReqMarkAsRead, ResMarkAsRead>) {
    let req = call.req;
    let uid = (call.conn as GameClientConn).uid!;
    let dbInfo = await dbUser.getUserInfoByUid(uid);
    if(dbInfo?.mails && dbInfo.mails.indexOf(req.mailId) == -1){
        call.error('not found');
        return;
    }
    await dbMail.markAsRead(req.mailId);
    call.succ({});
}