import { ApiCall } from "tsrpc";
import { ReqGetLobbyServerList, ResGetLobbyServerList } from "../../privateProtocols/master/PtlGetLobbyServerList";
import { masterSrv } from "../../SrvMaster/MasterSrv";

export default async function (call: ApiCall<ReqGetLobbyServerList, ResGetLobbyServerList>) {
    call.succ({ serverList: masterSrv.lobbyServerList });
}