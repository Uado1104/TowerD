import { ApiCall } from "tsrpc";
import { ReqModifyUserInfo, ResModifyUserInfo } from "../../shared/protocols/public/lobby/PtlModifyUserInfo";
import { GameClientConn } from "../../common/WebsocketGameServer";
import { dbUser } from "../../db/DBMgr";
import { basicConfig } from "../../configs/BasicConfig";

export async function ApiModifyUserInfo(call: ApiCall<ReqModifyUserInfo, ResModifyUserInfo>) {

    let req = call.req;
    let uid = (call.conn as GameClientConn).uid!;

    let userInfo = await dbUser.getUserInfoByUid(uid!);
    if (!userInfo) {
        return call.error('用户不存在');
    }
    if (userInfo.coin! < basicConfig.userInfoModifyCost) {
        return call.error('金币不足');
    }

    await dbUser.updateUserInfoByUid(uid!, { gender: req.gender, introduction: req.introduction, coin: userInfo.coin! - basicConfig.userInfoModifyCost });
    call.succ({ gender: req.gender, introduction: req.introduction });
}