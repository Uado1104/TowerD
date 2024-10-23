import { internalRPCHttpService } from "../common/HttpGameServer";
import { ServerArgs } from "../common/ServerArgs";
import { websocketPublicServer } from "../common/WebsocketGameServer";

export class ChatSystem {

    public start() {
        internalRPCHttpService.asPrivate.listenMsg("game/ChatTransform", call => {
            if (call.msg.channel == 'all' || call.msg.channel == 'lobby') {
                websocketPublicServer.server.broadcastMsg("chat/Chat", call.msg);
            }
        });
    }
}

export const chatSystem = new ChatSystem();