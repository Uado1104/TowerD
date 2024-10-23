import { _decorator, director, find, renderer, Sprite, Vec3 } from 'cc';
import { GameEvent, GameMgr } from '../../module_basic/scripts/GameMgr';
import { IGamePlayer } from '../../module_basic/shared/protocols/public/game/GameTypeDef';
import { ExtraNode, NodeUtils } from '../../module_basic/scripts/NodeUtils';
const { ccclass, property } = _decorator;

const tempV3 = new Vec3();

@ccclass('PlayerMovement2D')
export class PlayerMovement2D extends tgx.CharacterMovement2D {
    private _tmpSpeedFactor = 1.0;
    private _speedUpEndTime = 0;

    start(): void {
        super.start();
        //if player dies, stop movement
        //如果玩家死亡，则停止移动
        director.on(GameEvent.PLAYER_DIE, this.onPlayerDie,this);
    }

    onDestroy(): void {
        director.off(GameEvent.PLAYER_DIE, this.onPlayerDie,this);
    }

    onPlayerDie(player:IGamePlayer){
        if(player.playerId == GameMgr.inst.selfPlayer.playerId){
            this.onMovementStop();
        }
    }

    public tempSpeedUp(factor:number,time:number){
        this._tmpSpeedFactor = factor;
        this._speedUpEndTime = Date.now() + time;
    }

    onMovement(degree, strengthen){
        if(GameMgr.inst.selfPlayer.reviveTime > 0 || GameMgr.inst.gameData.gameState != 'playing'){
            return;
        }
        super.onMovement(degree,1.0);
    }

    onMovementStop(): void {
        
    }

    getRealSpeed(){
        return super.getRealSpeed() * this._tmpSpeedFactor;
    }

    update(deltaTime: number): void {
        super.update(deltaTime);
        if(this.getRealSpeed() > 0 && GameMgr.inst.gameData){
            NodeUtils.clampInMapBoundary(this.node as ExtraNode);
        }

        if(this._speedUpEndTime > 0 && Date.now() >= this._speedUpEndTime){
            this._tmpSpeedFactor = 1.0;
            this._speedUpEndTime = 0;
        }
    }
}

