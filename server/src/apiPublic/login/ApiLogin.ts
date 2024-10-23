import { ApiCall, TsrpcError } from "tsrpc";
import { ReqLogin, ResLogin } from "../../shared/protocols/public/login/PtlLogin";
import { TokenUtils } from "../../common/TokenUtils";
import { dbUser } from "../../db/DBMgr";
import { LOBBY_USE_HTTP } from "../../shared/configs/Constants";
import * as uuid from 'uuid';
import { websocketPublicServer } from "../../common/WebsocketGameServer";
import { httpPublicServer } from "../../common/HttpGameServer";
import { MasterSrvRPC } from "../../SrvMaster/MasterSrvRPC";
import { ServerState } from "../../shared/types/ServerDef";
import { ServerGlobals } from "../../common/ServerGloabls";
import { lobbySrv } from "../../SrvLobby/LobbySrv";

export async function ApiLogin(call: ApiCall<ReqLogin, ResLogin>) {

    let uid = await dbUser.getUIDWithAccountAndPassword(call.req.account, call.req.password);

    if (!uid) {
        return call.error('USER_NOT_EXISTS');
    }

    let time = Date.now();
    let token = TokenUtils.genReloginToken(uid, uuid.v4() + Math.random(), time);
    let sign = TokenUtils.genGameServerToken(uid, token, '', '', time);

    let ret = await MasterSrvRPC.get().getLobbyServerList();
    console.log(ret.res?.serverList.length);
    let minLoadServer:ServerState | undefined;
    ret.res?.serverList.forEach(server => {
        if(!minLoadServer || minLoadServer.userNum! > server.userNum!){
            minLoadServer = server;
        }
    });

    if(!minLoadServer && ServerGlobals.options.servicesMap['lobby']){
        minLoadServer = lobbySrv.serverState;
    }

    if(!minLoadServer){
        return call.error('NO_USEABLE_SERVER');
    }

    if(LOBBY_USE_HTTP){
        dbUser.updateUserInfoByUid(uid, { token: token });
    }

    call.succ({
        token: token,
        uid: uid,
        time: time,
        sign: sign,
        lobbyUrl:minLoadServer.publicUrl!
    })
}