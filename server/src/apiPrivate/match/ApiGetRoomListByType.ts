import { ApiCall } from "tsrpc";
import { ReqGetRoomListByType, ResGetRoomListByType } from "../../privateProtocols/match/PtlGetRoomListByType";
import { matchSrv } from "../../SrvMatch/MatchSrv";
import { IRoomFullState } from "../../privateProtocols/game/RoomStateDef";

export async function ApiGetRoomListByType(call: ApiCall<ReqGetRoomListByType, ResGetRoomListByType>) {
    let arr:IRoomFullState[] = [];
    let roomServers = matchSrv.roomServers;
    roomServers.forEach(roomServer=>{
        let rooms = roomServer.rooms;
        for(let j = 0; j < rooms.length; j++) {
            let room = rooms[j];
            if(room?.gameType == call.req.gameType){
                arr.push(room);
            }
        }
    });

    call.succ({roomList:arr});
}