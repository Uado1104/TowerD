import { _decorator, Component, KeyCode, Node } from 'cc';
import { GameUILayers } from '../../scripts/GameUILayers';
import { Layout_UIGameJoystick } from './Layout_UIGameJoystick';
import { GameMgr, Skill } from '../../module_basic/scripts/GameMgr';
import { ModuleDef } from '../../scripts/ModuleDef';

const activeSkillIds = [Skill.SKILL_1, Skill.SKILL_2];

@tgx_class(ModuleDef.GAME)
export class UIGameJoystick extends tgx.UIController {
    constructor(){
        super('ui_game_joystick/ui_game_joystick',GameUILayers.JOY_STICK,Layout_UIGameJoystick);
    }

    protected onCreated(): void {
        tgx.UIJoystick.inst.cleanKeyMap();
        tgx.UIJoystick.inst.bindKeyToButton(KeyCode.KEY_J, 'btn_skill_1');
        tgx.UIJoystick.inst.bindKeyToButton(KeyCode.KEY_K, 'btn_skill_2');
    }

    protected onUpdate(dt: number): void {
        let layout = this._layout as Layout_UIGameJoystick;
        activeSkillIds.forEach((skillId) => {
            let cdPercent = 0;
            let cdInfo = GameMgr.inst.getSkillCd(skillId);
            if (cdInfo) {
                cdPercent = cdInfo.cdPercent;
            }
            layout.cdSprites[skillId - Skill.SKILL_1].fillRange = cdPercent;
        });
    }
}