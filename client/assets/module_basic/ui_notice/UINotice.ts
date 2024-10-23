import { ImageAsset, Label, SpriteFrame, Texture2D, Toggle, assetManager, instantiate } from "cc";
import { GameUILayers } from "../../scripts/GameUILayers";
import { Layout_UINotice } from "./Layout_UINotice";
import { ModuleDef } from "../../scripts/ModuleDef";
import { LobbyMgr } from "../scripts/LobbyMgr";

@tgx_class(ModuleDef.BASIC)
export class UINotice extends tgx.UIController {

    constructor() {
        super("ui_notice/ui_notice", GameUILayers.POPUP, Layout_UINotice);
    }

    protected async onCreated(): Promise<void> {
        let layout = this._layout as Layout_UINotice;
        this.onButtonEvent(layout.btnClose, () => {
            this.close();
        });

        let tab = layout.tabs.node.children[0];
        layout.tabs.node.removeAllChildren();

        layout.emptyTips.active = true;
        layout.lblContent.node.active = false;
        layout.sprContent.node.active = false;
        layout.sprContent.spriteFrame = null;

        let ret = await LobbyMgr.inst.rpc_GetNotice();
        if (ret.isSucc && ret.res.noticeList.length) {
            layout.emptyTips.active = false;
            for (let i = 0; i < ret.res.noticeList.length; ++i) {
                let notice = ret.res.noticeList[i];
                let newTab = instantiate(tab);
                layout.tabs.node.addChild(newTab);
                newTab.getChildByName('Label').getComponent(Label).string = notice.title;
            }
            this.refreshContent(ret.res.noticeList[0]);
        }

        this.onToggleEvent(layout.tabs, (checkedItem: Toggle) => {
            let index = layout.tabs.toggleItems.indexOf(checkedItem);
            if (index != -1) {
                layout.lblContent.node.active = false;
                layout.sprContent.node.active = false;
                let notice = ret.res.noticeList[index];
                this.refreshContent(notice);
            }
        });
    }

    refreshContent(notice: any) {
        let layout = this._layout as Layout_UINotice;
        if (notice.contentType == 'text') {
            layout.lblContent.node.active = true;
            layout.lblContent.string = notice.content;
        }
        else if (notice.contentType == 'image') {
            layout.sprContent.node.active = true;
            assetManager.loadRemote(notice.content, ImageAsset, (err, img: ImageAsset) => {
                let texture = new Texture2D();
                texture.image = img;
                let spriteFrame = new SpriteFrame();
                spriteFrame.texture = texture;
                layout.sprContent.spriteFrame = spriteFrame;
            });
        }
    }
}


