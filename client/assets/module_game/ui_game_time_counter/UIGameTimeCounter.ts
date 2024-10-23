import { _decorator, Component, Label, Node } from 'cc';
import { GameUILayers } from '../../scripts/GameUILayers';
import { ModuleDef } from '../../scripts/ModuleDef';
import { GameMgr } from '../../module_basic/scripts/GameMgr';
const { ccclass, property } = _decorator;

/**
 * @en Layout component is used to mount on the root node of the UI corresponding to the Prefab, and declare a series of property references for tgxUIController to call.
 * @zh Layout 组件用于挂载到UI对应的Prefab根节点，并声明一系列 property 引用，供 tgxUIController 调用。
*/
@ccclass('UIGameTimeCounter')
export class Layout_UIGameTimeCounter extends Component {
    @property(Label) lblTips:Label;
    @property(Label) lblTimer: Label;
}


@tgx_class(ModuleDef.GAME)
export class UIGameTimeCounter extends tgx.UIController {
    constructor(){
        super('ui_game_time_counter/ui_game_time_counter',GameUILayers.POPUP,Layout_UIGameTimeCounter);
    }

    public get layout():Layout_UIGameTimeCounter{
        return this._layout as Layout_UIGameTimeCounter;
    }

    private _endTime = 0;
    
    protected onCreated(args:{tips?:string,endTime:number}): void {
        if(args.tips){
            this.layout.lblTips.string = args.tips;
        }
        this._endTime = args.endTime || 0;
    }

    protected onUpdate(dt: number): void {
        let remainingTime = this._endTime - Date.now();
        if(remainingTime <= 0){
            this.close();
        }
        else{
            remainingTime = Math.floor(remainingTime/1000);
            this.layout.lblTimer.string = remainingTime.toString();
        }
    }
}