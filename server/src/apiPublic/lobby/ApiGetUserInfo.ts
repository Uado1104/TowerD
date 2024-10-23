import { ApiCall } from "tsrpc";
import { ReqGetUserInfo, ResGetUserInfo } from "../../shared/protocols/public/lobby/PtlGetUserInfo";
import { UserInfo } from "../../shared/types/UserInfo";
import { dbUser } from "../../db/DBMgr";

export async function ApiGetUserInfo(call: ApiCall<ReqGetUserInfo, ResGetUserInfo>) {

    let infos: Array<UserInfo> = [];
    if (call.req.uid) {
        let info = await dbUser.getUserInfoByUid(call.req.uid);
        if(info){
            infos.push({ uid: info.uid!, name: info.name, visualId: info.visualId, gender: info.gender, introduction: info.introduction });
        }
    }
    if (call.req.uids) {
        for (let i = 0; i < call.req.uids.length; ++i) {
            let info = await dbUser.getUserInfoByUid(call.req.uids[i]);
            if(info){
                infos.push({ uid: info.uid!, name: info.name, visualId: info.visualId, gender: info.gender, introduction: info.introduction });
            }
        }
    }

    call.succ({ infos });
}