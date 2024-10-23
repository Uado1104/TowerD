import { _decorator, Component, director, instantiate, Node } from 'cc';
import { GameUILayers } from '../../scripts/GameUILayers';
import { Layout_UIGameRank } from './Layout_UIGameRank';
import { GameEvent, GameMgr } from '../../module_basic/scripts/GameMgr';
import { TankGameRankItem } from './GameRankItem';
import { ModuleDef } from '../../scripts/ModuleDef';
import { MsgGameDataChangedPush } from '../../module_basic/shared/protocols/public/game/MsgGameDataChangedPush';
import { TEAM_ID_MAP } from '../../module_basic/shared/types/TeamInfo';

@tgx_class(ModuleDef.GAME)
export class UIGameRank extends tgx.UIController {
    constructor(){
        super('ui_game_rank/ui_game_rank',GameUILayers.HUD,Layout_UIGameRank);
    }
    
    protected onCreated(): void {
        this.refreshRank();

        director.on(GameEvent.PLAYER_COMES,this.refreshRank,this);
        director.on(GameEvent.PLAYER_LEAVES,this.refreshRank,this);
        director.on(GameEvent.GAME_DATA_CHANGED,this.onGameDataChanged,this);
    }

    protected onDispose(): void {
        director.off(GameEvent.PLAYER_COMES,this.refreshRank,this);
        director.off(GameEvent.PLAYER_LEAVES,this.refreshRank,this);
        director.off(GameEvent.GAME_DATA_CHANGED,this.onGameDataChanged,this);
    }

    onGameDataChanged(msg:MsgGameDataChangedPush){
        if(msg.teamWeights != undefined){
            this.refreshRank();
        }
    }

    async refreshRank(){
        let teams = Object.keys(GameMgr.inst.gameData.teamsWeights);
        teams.sort((a,b)=>{
            return GameMgr.inst.gameData.teamsWeights[b] - GameMgr.inst.gameData.teamsWeights[a];
        });

        let layout = this._layout as Layout_UIGameRank;

        layout.listRoot.children.forEach((node)=>{ 
            node.active = false;
        });

        for(let i = 0; i < teams.length; ++i){
            let teamId = Number(teams[i]);
            let teamWeight = GameMgr.inst.gameData.teamsWeights[teamId];
            let teamName = TEAM_ID_MAP[teamId].name;
            let node = layout.listRoot.children[i];
            if(!node){
                node = instantiate(layout.listRoot.children[0]);
                layout.listRoot.addChild(node);
            }
            node.active = true;
            let item = node.getComponent(TankGameRankItem);
            item.setInfo(i+1,teamName,teamWeight,teamId);
        }
    }
}