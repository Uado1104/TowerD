import { _decorator, Component, Node, v3, Vec3, Vec2, v2, Prefab, instantiate, tween, KeyCode } from 'cc';
import { GameMgr, Skill } from '../../module_basic/scripts/GameMgr';
import { Cell } from './Cell';
import { PlayerMovement2D } from './PlayerMovement2D';

const { ccclass, property } = _decorator;

const tempV2 = v2();

@ccclass('PlayerController')
export class PlayerController extends Component {
    @property(Node)
    firePoint: Node;

    @property(Node)
    barrel: Node;

    private _movement2d: PlayerMovement2D;

    start() {
        tgx.EasyController.on(tgx.EasyControllerEvent.BUTTON, this.onButtonHit, this);
        this._movement2d = this.node.getComponent(PlayerMovement2D);
    }

    onButtonHit(btnSlot: string) {
        if (btnSlot == 'btn_skill_1') {
            if (GameMgr.inst.castSkill(Skill.SKILL_1)) {
                //this._cell.shoot();
            }
        }
        if (btnSlot == 'btn_skill_2') {
            if (GameMgr.inst.castSkill(Skill.SKILL_2)) {
                this._movement2d.tempSpeedUp(2.0, 3000);
            }
        }
    }

    onDestroy() {
        tgx.EasyController.off(tgx.EasyControllerEvent.BUTTON, this.onButtonHit, this);
    }
}


