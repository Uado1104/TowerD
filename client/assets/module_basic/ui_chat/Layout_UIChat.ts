import { _decorator, Component, Node, EditBox, Prefab, Button } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Layout_UIChat')
export class Layout_UIChat extends Component {
    @property(EditBox)
    inputChat!: EditBox;

    @property(Node)
    chatBar:Node;

    @property(Prefab)
    prefabChatMsgItem!: Prefab;

    @property(Node)
    chatMsgs!: Node;

    @property(Button)
    btnExpand:Button;

    @property(Button)
    btnFold:Button;


    cbInputChatReturn:Function;
    async onInputChatReturn(){
        if(this.cbInputChatReturn){
            this.cbInputChatReturn();
        }
    }
    
    cbBtnSendChat:Function;
    async onBtnSendChat(){
        if(this.cbBtnSendChat){
            await this.cbBtnSendChat();
        }
    }
}


