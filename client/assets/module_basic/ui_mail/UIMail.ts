import { Node, instantiate } from "cc";
import { GameUILayers } from "../../scripts/GameUILayers";
import { Layout_UIMail } from "./Layout_UIMail";
import { MailItem } from "./MailItem";
import { lobbyNet } from "../scripts/NetGameServer";
import { ModuleDef } from "../../scripts/ModuleDef";

@tgx_class(ModuleDef.BASIC)
export class UIMail extends tgx.UIController {
    constructor() {
        super("ui_mail/ui_mail", GameUILayers.POPUP, Layout_UIMail);
    }

    private _itemPrefab: Node = null;

    private _lastSelected: MailItem = null;

    protected onCreated(): void {
        let layout = this._layout as Layout_UIMail;

        this._itemPrefab = layout.mailRoot.children[0];
        layout.mailRoot.removeAllChildren();

        this.onButtonEvent(layout.btnClose, () => {
            this.close();
        });

        this.onButtonEvent(layout.btnMarkAllAsRead, async () => {
            let ret = await lobbyNet.callApi('lobby/mail/MarkAllAsRead', { });
            if (ret.isSucc) {
                this.onMarkAllAsRead();
            }
        });

        this.onButtonEvent(layout.btnClearAll, async () => {
            tgx.UIAlert.show('确定要删除吗？', true).onClick(async b => {
                if (b) {
                    let ret = await lobbyNet.callApi('lobby/mail/ClearAllMails', { });
                    if (ret.isSucc) {
                        layout.mailRoot.removeAllChildren();
                        layout.lblContent.node.active = false;
                        layout.emptyTips.active = true;
                        this._lastSelected = null;
                    }
                }
            });
        });

        this.onButtonEvent(layout.btnDelete, () => {
            tgx.UIAlert.show('确定要删除吗？', true).onClick(async b => {
                if (b) {
                    let deleteItem = this._lastSelected;
                    let ret = await lobbyNet.callApi('lobby/mail/DeleteMail', { mailId: this._lastSelected.data.mailId });
                    if (ret.isSucc) {
                        deleteItem.node.removeFromParent();
                        if (!layout.mailRoot.children.length) {
                            layout.lblContent.node.active = false;
                            layout.emptyTips.active = true;
                            this._lastSelected = null;
                        }
                        else {
                            this.setAsSelected(layout.mailRoot.children[0].getComponent(MailItem));
                        }
                    }
                }
            });
        });

        this.initMailList();
    }

    onMarkAllAsRead() {
        let layout = this._layout as Layout_UIMail;
        layout.mailRoot.children.forEach(v => {
            let comp = v.getComponent(MailItem);
            comp.hasRead.active = true;
            comp.data.state = 'read';
        });
    }

    async initMailList() {
        let layout = this._layout as Layout_UIMail;
        let ret = await lobbyNet.callApi('lobby/mail/GetMails', { });
        if (!ret.isSucc) {
            layout.emptyTips.active = true;
            return;
        }

        layout.emptyTips.active = false;

        if(!ret.res.mails.length){
            layout.emptyTips.active = true;
            return;
        }

        ret.res.mails.sort((a, b): number => {
            return b.time - a.time;
        });

        let index = 0;
        ret.res.mails.forEach(v => {
            let item = instantiate(this._itemPrefab);
            layout.mailRoot.addChild(item);
            let comp = item.getComponent(MailItem);
            comp.setData(v);

            this.onButtonEvent(item, () => {
                if (this._lastSelected != comp) {
                    this.setAsSelected(comp);
                }
            });

            if (index == 0) {
                layout.lblContent.string = comp.data.content;
                comp.selected = true;
                this._lastSelected = comp;
            }
            else {
                comp.selected = false;
            }

            index++;
        });
    }

    async setAsSelected(comp: MailItem) {
        let layout = this._layout as Layout_UIMail;
        layout.lblContent.node.active = true;
        layout.lblContent.string = comp.data.content + '\n' + new Date(comp.data.time).toString();
        comp.selected = true;
        this._lastSelected.selected = false;
        this._lastSelected = comp;
        if (!comp.data.state) {
            let ret = await lobbyNet.callApi('lobby/mail/MarkAsRead', { mailId: comp.data.mailId });
            if (ret.isSucc) {
                comp.data.state = 'read';
                comp.hasRead.active = true;
            }
        }
    }
}


