import { _decorator, Component, Node } from 'cc';
import { GameUILayers } from '../../scripts/GameUILayers';
import { Layout_UIAboutQLZ } from './Layout_UIAboutQLZ';
import { ModuleDef } from '../../scripts/ModuleDef';

@tgx_class(ModuleDef.BASIC)
export class UIAboutQLZ extends tgx.UIController {
    constructor(){
        super('ui_about_qlz/ui_about_qlz',GameUILayers.POPUP,Layout_UIAboutQLZ);
    }

    protected onCreated(): void {
        let layout = this._layout as Layout_UIAboutQLZ;
        this.onButtonEvent(layout.btnClose,()=>{
            this.close();
        });
    }
}

