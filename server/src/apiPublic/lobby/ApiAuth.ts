import { ApiCall } from "tsrpc";
import { ReqAuth, ResAuth } from "../../shared/protocols/public/lobby/PtlAuth";
import { TokenUtils } from "../../common/TokenUtils";
import { MasterSrvRPC } from "../../SrvMaster/MasterSrvRPC";
import { dbUser } from "../../db/DBMgr";
import { MatchSrvRPC } from "../../SrvMatch/MatchSrvRPC";
import { mailSystem } from "../../SrvGame/MailSystem";
import { GameClientConn } from "../../common/WebsocketGameServer";

export default async function (call: ApiCall<ReqAuth, ResAuth>) {

    let sign = TokenUtils.genGameServerToken(call.req.uid, call.req.token, '', '', call.req.time);
    if(sign != call.req.sign){
        return call.error('INVALID_TOKEN');
    }

    let userInfo = await dbUser.getUserInfoByUid(call.req.uid);
    if(!userInfo){
        return call.error('INVALID_USER');
    }

    let masterSrvRPC = MasterSrvRPC.get();
    

    let gameServerPublicUrl = '';
    let gameServerInternalUrl = '';
    let roomId = '';
    let gameType = '';
    //@en if user's room is valid, then enter the room directly
    //@zh 如果用户之前的房间有效，则直接进入之间的房间
    let loc = await masterSrvRPC.getUserLocation(userInfo.uid!);
    if (loc.isSucc && loc.res.roomId) {
        let ret = await MatchSrvRPC.get().getRoomState(loc.res.roomId);
        if (ret.isSucc && ret.res?.state) {
            gameServerPublicUrl = ret.res.state.serverPublicUrl!;
            gameServerInternalUrl = ret.res.state.serverInternalUrl!;
            roomId = loc.res.roomId;
            gameType = loc.res.gameType!;
        }
    }

    //@zh 尝试踢掉用户
    let ret = await masterSrvRPC.userLoginPrepare(userInfo.uid!, gameServerInternalUrl);
    if (!ret.isSucc) {
        return call.error(ret.err.message);
    }

    MasterSrvRPC.get().updateUserLocation([userInfo.uid!], { serverUrl: gameServerInternalUrl, roomId: roomId, gameType: gameType });

    let conn = call.conn as GameClientConn;
    conn.uid = userInfo.uid;
    conn.dbUserInfo = userInfo;
    
    if (!userInfo.name) {
        //if name is not set, then  return
        //如果还未创建角色，则直接返回

        call.succ({
            userInfo: {
                name: userInfo.name,
                visualId: userInfo.visualId,
                uid: userInfo.uid!,
                gender: userInfo.gender,
                introduction: userInfo.introduction,
            },
            roomId:roomId,
        });
        return;
    }


    //send an email to user(this is just for test, you can remove it if you don't need)
    //发送一封邮件（这个仅用于测试邮件系统，可根据需要随时移除）
    mailSystem.sendMail('system', userInfo.uid!, '欢迎登录', userInfo.name + '，你好！\n这封邮件会在你每次登录的时候收到，如果不需要，请在 ApiLogin.ts 中删除相关代码即可。');

    call.succ({
        userInfo: {
            name: userInfo.name,
            visualId: userInfo.visualId,
            uid: userInfo.uid!,
            gender: userInfo.gender,
            introduction: userInfo.introduction,
            coin: userInfo.coin,
        },
        roomId:roomId,
    });
}