import { _decorator, Component, screen, ResolutionPolicy, Size, size, view, UITransform, Sprite, Canvas } from 'cc';
const { ccclass, property } = _decorator;

const CHECK_INTERVAL = 0.1;

@ccclass('FullScreenBgAutoFit')
export class FullScreenBgAutoFit extends Component {
    
    @property(Canvas) canvasUITrans:UITransform;

    private _oldSize:Size = size();
    private _originalSize:Size;
    private _uiTransform:UITransform;
    private _sprite:Sprite;

    start() {
        this._uiTransform = this.getComponent(UITransform);
        this._sprite = this.getComponent(Sprite);
        if(!this._uiTransform || !this._sprite){
            return;
        }
        this._originalSize =  this._sprite.spriteFrame.originalSize;
        this._sprite.sizeMode = Sprite.SizeMode.CUSTOM;

        if(!this.canvasUITrans){
            let parent = this.node.parent;
            while(parent){
                let canvas = parent.getComponent(Canvas);
                if(canvas){
                    this.canvasUITrans = canvas.getComponent(UITransform);
                    break;
                }
                parent = parent.parent;
            }
        }

        this.adjustResolutionPolicy();
    }

    private lastCheckTime = 0;
    update(deltaTime: number) {
        this.lastCheckTime+=deltaTime;
        if(this.lastCheckTime < CHECK_INTERVAL){
            return;
        }
        this.lastCheckTime = 0;

        this.adjustResolutionPolicy();
    }

    adjustResolutionPolicy(){
        let winSize = this.canvasUITrans.contentSize;
        if(!this._oldSize.equals(winSize)){
            let ratio = winSize.width / winSize.height;
            let imgW2H = this._originalSize.width / this._originalSize.height;

            if(ratio > imgW2H){
                //wider than desgin.
                this._uiTransform.width = winSize.width;
                this._uiTransform.height = winSize.width / imgW2H;
            }
            else{
                //higher than desgin.
                this._uiTransform.width = winSize.height * imgW2H;
                this._uiTransform.height = winSize.height;
            }
            this._oldSize.set(winSize);
        }
    }
}

