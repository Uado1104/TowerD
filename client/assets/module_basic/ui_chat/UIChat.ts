import { director, instantiate, RichText, Node, Widget } from "cc";
import { GameUILayers } from "../../scripts/GameUILayers";
import { Layout_UIChat } from "./Layout_UIChat";
import { RoomEvent, RoomMgr } from "../scripts/RoomMgr";
import { MsgChat } from "../shared/protocols/public/chat/MsgChat";
import { getSubGameConf } from "../scripts/SubGameDef";
import { ModuleDef } from "../../scripts/ModuleDef";
import { MsgUserComesToRoomPush } from "../shared/protocols/public/room/MsgUserComesToRoomPush";
import { MsgUserLeavesFromRoomPush } from "../shared/protocols/public/room/MsgUserLeavesFromRoomPush";
import { NetGameServer } from "../scripts/NetGameServer";

@tgx_class(ModuleDef.BASIC)
export class UIChat extends tgx.UIController {
    private static _chatItemPool: Node[] = [];
    private getFromPool() {
        let layout = this._layout as Layout_UIChat;
        let item = UIChat._chatItemPool.shift();
        if (!item) {
            item = instantiate(layout.prefabChatMsgItem);
        }
        layout.chatMsgs.addChild(item);
        return item;
    }
    private putToPool(item: Node) {
        item.removeFromParent();
        UIChat._chatItemPool.push(item);
    }

    private _isFolded = true;
    private _chatNet:NetGameServer;

    constructor() {
        super('ui_chat/ui_chat', GameUILayers.HUD, Layout_UIChat);
    }
    protected onCreated(net:NetGameServer): void {
        this._chatNet = net;
        this._chatNet.listenMsg('chat/Chat', this.addChatMsg, this);

        director.on(RoomEvent.NEW_USER_COMES, this.onUserComes,this);
        director.on(RoomEvent.USER_LEAVES, this.onUserLeaves,this);

        let layout = this._layout as Layout_UIChat;
        layout.cbInputChatReturn = this.onInputChatReturn.bind(this);

        layout.cbBtnSendChat = this.onBtnSendChat.bind(this);

        layout.btnExpand.node.active = true;
        layout.btnFold.node.active = false;
        let w = layout.chatMsgs.getComponent(Widget);
        w.bottom = 15;
        w.left = 10;
        layout.chatBar.active = false;
        this._isFolded = true;

        this.onButtonEvent(layout.btnExpand, () => {
            this._isFolded = false;

            layout.btnExpand.node.active = false;
            layout.btnFold.node.active = true;
            layout.chatBar.active = true;

            let w = layout.chatMsgs.getComponent(Widget);
            w.bottom = 110;
            w.left = 10;
        });

        this.onButtonEvent(layout.btnFold, () => {
            this._isFolded = true;

            layout.btnExpand.node.active = true;
            layout.btnFold.node.active = false;
            layout.chatBar.active = false;

            let w = layout.chatMsgs.getComponent(Widget);
            w.bottom = 15;
            w.left = 10;
        });

        let messages;// = SubGameMgr.gameMgr.data?.messages;
        if (messages && messages.length) {
            for (let i = 0; i < messages.length; ++i) {
                let msg = messages[i];
                this.addChatMsg(msg);
            }
        }
    }

    async onUserComes(v:MsgUserComesToRoomPush) {
        let info = RoomMgr.inst.getUser(v.uid);
        this._pushChatMsg(`<outline width=1 color=#0><color=#33A8E9>${info?.name}(${info?.uid})</color> <color=#999999>加入了房间</color></o>`);
    }

    async onUserLeaves(v:MsgUserLeavesFromRoomPush) {
        let info = RoomMgr.inst.getUser(v.uid);
        this._pushChatMsg(`<outline width=1 color=#0><color=#33A8E9>${info?.name}(${info?.uid})</color> <color=#999999>离开了房间</color></o>`);
    }

    addChatMsg(msg: MsgChat) {
        let str = '';
        if (msg.channel == 'global') {
            str = '[全部]';
        }
        else if (msg.channel) {
            str = `[${getSubGameConf(msg.channel).name || ''}]`;
        }
        this._pushChatMsg(`<outline width=1 color=#0><color=#33A8E9>${str}${msg.user.name}(${msg.user.uid})</color> <color=#FFFFFF>${msg.content}</color></o>`);
    }

    protected onDispose(): void {
        this._chatNet.unlistenMsg('chat/Chat', this.addChatMsg, this);
        director.off(RoomEvent.NEW_USER_COMES, this.onUserComes,this);
        director.off(RoomEvent.USER_LEAVES, this.onUserLeaves,this);
    }

    async onBtnSendChat() {
        let layout = this._layout as Layout_UIChat;
        if (!layout.inputChat.string) {
            return;
        }

        let content = layout.inputChat.string;

        let channel = undefined;
        let index = content.indexOf(' ');
        if (index != -1) {
            let headStr = content.substring(0, index);
            if (headStr == '@全部' || headStr == '@g') {
                channel = 'global';
            }
            content = content.substring(index + 1);
        }

        if (!channel && director.getScene().name.indexOf('lobby') == 0) {
            channel = 'lobby';
        }

        layout.inputChat.string = '';
        let ret = await this._chatNet.callApi('chat/SendChat', {
            channel: channel,
            content: content
        });
        layout.inputChat.string = '';

        if (!ret.isSucc) {
            this._pushChatMsg(`<color=#999999>消息发送失败，请重试!</color></o>`);
            layout.inputChat.string = content;
            return;
        }
    }
    async onInputChatReturn() {
        let layout = this._layout as Layout_UIChat;
        await this.onBtnSendChat();
        layout.inputChat.focus();
    }

    private _pushChatMsg(richText: string) {
        if (this._destroyed) {
            console.log('UIChat._pushChatMsg: destroyed');
            return;
        }
        let layout = this._layout as Layout_UIChat;

        const maxLen = this._isFolded ? 2 : 7;
        // 最多保留 7 条记录
        while (layout.chatMsgs.children.length >= maxLen) {
            this.putToPool(layout.chatMsgs.children[0]);
        }

        let node = this.getFromPool();
        node.getComponent(RichText)!.string = richText;
    }
}