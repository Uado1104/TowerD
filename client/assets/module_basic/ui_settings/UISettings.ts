import { profiler } from "cc";
import { GameUILayers } from "../../scripts/GameUILayers";
import { UserLocalCache } from "../scripts/UserLocalCache";
import { Layout_UISettings } from "./Layout_UISettings";
import { ModuleDef } from "../../scripts/ModuleDef";

@tgx_class(ModuleDef.BASIC)
export class UISettings extends tgx.UIController {
    constructor() {
        super("ui_settings/ui_settings", GameUILayers.POPUP, Layout_UISettings);
    }

    protected onCreated(): void {
        let layout = this._layout as Layout_UISettings;

        layout.sliderMusic.progress = UserLocalCache.inst.musicVolume;
        layout.sliderSound.progress = UserLocalCache.inst.soundVolume;

        this.onButtonEvent(layout.btnClose, () => {
            this.close();
        });

        this.onSlideEvent(layout.sliderMusic, () => {
            tgx.AudioMgr.inst.musicVolume = UserLocalCache.inst.musicVolume = layout.sliderMusic.progress;
        });

        this.onSlideEvent(layout.sliderSound, () => {
            tgx.AudioMgr.inst.soundVolume = UserLocalCache.inst.soundVolume = layout.sliderSound.progress;
        });

        layout.chkFPS.isChecked = profiler.isShowingStats();
        this.onToggleEvent(layout.chkFPS, () => {
            if(layout.chkFPS.isChecked){
                profiler.showStats();
            }
            else{
                profiler.hideStats();
            }
        });
    }
}


