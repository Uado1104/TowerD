import { _decorator, Component, find, instantiate, Node, Prefab, Quat, v2 } from 'cc';
import { GameAudioMgr } from './GameAudioMgr';
import { Cell } from './Cell';
import { IGamePlayer } from '../../module_basic/shared/protocols/public/game/GameTypeDef';
import { GameMgr } from '../../module_basic/scripts/GameMgr';
import { CellMgr, CellType } from './CellMgr';
import { GameResMgr } from './GameResMgr';
const { ccclass, property } = _decorator;

@ccclass('CellBullet')
export class CellBullet extends Component {

    @property
    moveSpeed: number = 400;

    @property
    lifeTime: number = 3000;

    /**
     * @en the bullet belongs to which player
     * @zh 子弹所属的玩家 id
    */
    player: IGamePlayer;

    damage: number = 10;

    private _lifeStart = 0;
    private _moveDir = v2();
    public set moveDir(v) {
        this._moveDir.set(v);
    }
    start() {
        this._lifeStart = Date.now();
        this.damage = Math.floor(Math.random() * 15 + 10);
    }

    update(deltaTime: number) {
        if (this._lifeStart + this.lifeTime < Date.now()) {
            this.lifeEnd();
            return;
        }
        let dist = this.moveSpeed * deltaTime;
        let dx = this._moveDir.x * dist;
        let dy = this._moveDir.y * dist;
        let pos = this.node.position;
        this.node.setPosition(pos.x + dx, pos.y + dy, pos.z);
    }

    lifeEnd() {
        this.node.destroy();
    }

    protected lateUpdate(dt: number): void {
        const tankBodyRadius = 50;
        let cellList = CellMgr.inst.cellList;
        for (let i = 0; i < cellList.length; i++) {
            let cell = cellList[i] as CellType;
            let bp = this.node.worldPosition;
            let tp = cell.node.worldPosition;
            let dx = bp.x - tp.x;
            let dy = bp.y - tp.y;
            if (dx * dx + dy * dy < tankBodyRadius * tankBodyRadius) {
                if(this.player != cell.player){
                    this.lifeEnd();
                }

                /**
                 * @en if this bullet belongs to other player, then this.player is null, no damage calculation
                 * @zh 如果是其他玩家的子弹，this.player 为 null，不做伤害计算
                */
                if (this.player && this.player.color != cell.player.color) {
                    //cell.beAttack(this.player.playerId, this.damage, this.node.worldPosition);
                }
                break;
            }
        }
    }
}