import { MasterSrvRPC } from "../SrvMaster/MasterSrvRPC";
import { HttpRPC } from "../common/HttpRPC";
import { MsgChatTransform } from "../privateProtocols/game/MsgChatTransform";
export class GameSrvRPC extends HttpRPC{

    public static get(serverUrl:string){
        return HttpRPC.getRPCClient(serverUrl,GameSrvRPC) as GameSrvRPC;
    }

    public async kickUser(uid:string,reason:string){
        return await this._httpClient.callApi("game/KickUser",{uid:uid,reason:reason});
    }

    public static async broadcastChatMsg(msg:MsgChatTransform){
        let ret = await MasterSrvRPC.get().getGameServerList();
        if(ret.isSucc){
            for(let server of ret.res.serverList){
                let rpc = GameSrvRPC.get(server.interalUrl!);
                rpc._httpClient.sendMsg("game/ChatTransform",msg);
            }
        }
    }

    public getAllUserLocations(){
        return this._httpClient.callApi("game/GetAllUserLocations",{});
    }

    public getRoomStates(){
        return this._httpClient.callApi("game/GetRoomStates",{});
    }
}