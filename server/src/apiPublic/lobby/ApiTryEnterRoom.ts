import { ApiCall } from "tsrpc";
import { ReqTryEnterRoom, ResTryEnterRoom } from "../../shared/protocols/public/lobby/PtlTryEnterRoom";
import { TokenUtils } from "../../common/TokenUtils";
import { GameClientConn } from "../../common/WebsocketGameServer";
import { MatchSrvRPC } from "../../SrvMatch/MatchSrvRPC";
import { MasterSrvRPC } from "../../SrvMaster/MasterSrvRPC";

export async function ApiTryEnterRoom(call: ApiCall<ReqTryEnterRoom, ResTryEnterRoom>) {
    let req = call.req;
    let uid = (call.conn as GameClientConn).uid!;

    let ret = await MatchSrvRPC.get().getRoomState(req.id);
    if (!ret.isSucc) {
        call.error('OUT_OF_SERVICE');
        return;
    }

    let roomState = ret.res?.state!;
    if(!roomState){
        call.error('OUT_OF_SERVICE');
        return;
    }

    let oldRoomId = '';
    let loc = await MasterSrvRPC.get().getUserLocation(uid);
    if (loc.isSucc) {
        oldRoomId = loc.res.roomId || '';
    }
    let needCheckPassword = roomState.password && roomState.id != oldRoomId;

    if (needCheckPassword && roomState.password != req.password) {
        return call.error("INVALID_PASSWORD");
    }

    let url = roomState.serverPublicUrl!;
    let time = Math.floor(Date.now() / 1000);

    let token = TokenUtils.genGameServerToken(uid, url, roomState.id, roomState.gameType, time);

    call.succ({ roomId: roomState.id, gameType: roomState.gameType, serverUrl: url, token: token, time: time });
}