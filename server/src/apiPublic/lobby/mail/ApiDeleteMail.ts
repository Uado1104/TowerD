import { ApiCall } from "tsrpc";
import { ReqDeleteMail, ResDeleteMail } from "../../../shared/protocols/public/lobby/mail/PtlDeleteMail";
import { GameClientConn } from "../../../common/WebsocketGameServer";
import { dbMail, dbUser } from "../../../db/DBMgr";

export async function ApiDeleteMail(call: ApiCall<ReqDeleteMail, ResDeleteMail>) {
    let req = call.req;
    let uid = (call.conn as GameClientConn).uid!;
    let dbData = await dbUser.getUserInfoByUid(uid);
    if(!dbData){
        return;
    }
    let index = (dbData.mails&&dbData.mails.length)? dbData.mails.indexOf(req.mailId):-1;
    if(index != -1) {
        dbMail.deleteMail(req.mailId);

        dbData.mails!.splice(index, 1);
        dbUser.updateUserInfoByUid(uid, {mails: dbData.mails});
        
        call.succ({});
    }
    else{
       return call.error('do_not_have_this_mail');
    }
}