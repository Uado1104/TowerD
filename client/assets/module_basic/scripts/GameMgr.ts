import { Game, director } from "cc";
import { RoomMgr } from "../../module_basic/scripts/RoomMgr";
import { UserMgr } from "../../module_basic/scripts/UserMgr";
import { gameNet } from "../../module_basic/scripts/NetGameServer";
import { IGameData, IGamePlayer } from "../../module_basic/shared/protocols/public/game/GameTypeDef";
import { MsgFoodAddedPush } from "../../module_basic/shared/protocols/public/game/MsgFoodAddedPush";
import { MsgFoodEatenPush } from "../../module_basic/shared/protocols/public/game/MsgFoodEatenPush";
import { MsgGameBeginPush } from "../../module_basic/shared/protocols/public/game/MsgGameBeginPush";
import { MsgGameDataChangedPush } from "../../module_basic/shared/protocols/public/game/MsgGameDataChangedPush";
import { MsgGameDataSyncPush } from "../../module_basic/shared/protocols/public/game/MsgGameDataSyncPush";
import { MsgGameOverPush } from "../../module_basic/shared/protocols/public/game/MsgGameOverPush";
import { MsgPlayerComesPush } from "../../module_basic/shared/protocols/public/game/MsgPlayerComesPush";
import { MsgPlayerDataChangedPush } from "../../module_basic/shared/protocols/public/game/MsgPlayerDataChangedPush";
import { MsgPlayerLeavesPush } from "../../module_basic/shared/protocols/public/game/MsgPlayerLeavesPush";
import { MsgCellDataChange } from "../../module_basic/shared/protocols/public/game/MsgCellDataChange";

export class GameEvent {
    public static PLAYER_COMES = 'GameEvent.PLAYER_COMES';
    public static PLAYER_LEAVES = 'GameEvent.PLAYER_LEAVES';
    public static PLAYER_DATA_CHANGED = 'GameEvent.PLAYER_DATA_CHANGED';
    public static GAME_BEGIN = 'GameEvent.GAME_BEGIN';
    public static GAME_OVER = 'GameEvent.GAME_OVER';
    public static CELL_DATA_CHANGED = 'GameEvent.CELL_DATA_CHANGED';

    public static FOOD_EATEN = 'GameEvent.FOOD_EATEN';
    public static FOOD_ADDED = 'GameEvent.FOOD_ADDED';

    public static PLAYER_DIE = 'GameEvent.PLAYER_DIE';
    public static PLAYER_REVIVE = 'GameEvent.PLAYER_REVIVE';

    public static GAME_DATA_CHANGED = 'GameEvent.GAME_DATA_CHANGED';
}

export class Skill {
    public static SKILL_1 = 1000;
    public static SKILL_2 = 1001;
    public id: number;
    public cd: number;
}

export class SillCastInfo {
    skill: Skill;
    lastCastTime: number;

    get isInCD() {
        let cdTime = this.lastCastTime + this.skill.cd - Date.now();
        return cdTime > 0;
    }

    get cdPercent() {
        let cdTime = this.lastCastTime + this.skill.cd - Date.now();
        if (cdTime <= 0) {
            return 0.0;
        }
        return cdTime / this.skill.cd;
    }
}

const skillMap = {};
skillMap[Skill.SKILL_1] = { id: Skill.SKILL_1, cd: 2000 };
skillMap[Skill.SKILL_2] = { id: Skill.SKILL_1, cd: 30000 };

export class GameMgr {
    private static _inst: GameMgr;
    public static get inst(): GameMgr {
        if (!this._inst) {
            this._inst = new GameMgr();
        }
        return this._inst;
    }

    constructor() {
        this.initNetMsgHandlers();
    }

    public reset(){
        this._gameData = null;
        this._playerMap = {};
        this._skillCdMap = {};
    }

    private _gameData: IGameData;
    private _gameStateEndTime: number = 0;
    private _playerMap: { [key: number]: IGamePlayer } = {};
    private _skillCdMap: { [key: number]: SillCastInfo } = {};

    private _selfPlayer: IGamePlayer;
    public get selfPlayer(): IGamePlayer {
        return this._selfPlayer;
    }

    public get gameData(): Readonly<IGameData> {
        return this._gameData;
    }

    public get gameStateEndTime(): number {
        return this._gameStateEndTime;
    }

    public castSkill(skillId: number) {
        let skill = skillMap[skillId];
        if (!skill) {
            return false;
        }

        let cdInfo = this._skillCdMap[skillId];
        if (!cdInfo) {
            cdInfo = new SillCastInfo();
            cdInfo.skill = skill;
            cdInfo.lastCastTime = 0;
            this._skillCdMap[skillId] = cdInfo;
        }
        if (cdInfo.isInCD) {
            return false;
        }

        cdInfo.lastCastTime = Date.now();
        return true;
    }
    public getSkillCd(skillId: number) {
        return this._skillCdMap[skillId];
    }

    initNetMsgHandlers() {
        gameNet.listenMsg("game/GameDataSyncPush", this.onNet_GameDataSyncPush, this);
        gameNet.listenMsg("game/GameDataChangedPush", this.onNet_GameDataChangedPush, this);

        gameNet.listenMsg("game/PlayerComesPush", this.onNet_PlayerComesPush, this);
        gameNet.listenMsg("game/PlayerDataChangedPush", this.onNet_PlayerDataChangedPush, this);
        gameNet.listenMsg("game/PlayerLeavesPush", this.onNet_PlayerLeavesPush, this);

        gameNet.listenMsg("game/GameBeginPush", this.onNet_GameBeginPush, this);
        gameNet.listenMsg("game/GameOverPush", this.onNet_GameOverPush, this);

        gameNet.listenMsg('game/CellDataChange', this.onNet_CellDataChange, this);

        gameNet.listenMsg('game/FoodEatenPush', this.onNet_FoodEatenPush, this);
        gameNet.listenMsg('game/FoodAddedPush', this.onNet_FoodAddedPush, this);
    }

    sendMsg_CellDataChange(x: number, y: number, z: number, rotation: number) {
        gameNet.sendMsg('game/CellDataChange', { transform: [x, y, z, rotation] });
    }

    private get selfPlayerIndex(): number {
        return this.getPlayerIndex(UserMgr.inst.uid);
    }

    public get leftUserId(): string {
        if (!this._gameData || this._gameData.players.length == 0) {
            return '';
        }

        if (RoomMgr.inst.isPlayer) {
            return UserMgr.inst.uid;
        }
        else {
            return this._gameData.players[0].uid;
        }
    }

    public get rightUserId(): string {
        if (!this._gameData || this._gameData.players.length == 0) {
            return '';
        }

        if (RoomMgr.inst.isPlayer) {
            if (this._gameData.players[0].uid != UserMgr.inst.uid) {
                return this._gameData.players[0].uid;
            }
            else {
                let p = this._gameData.players[1];
                return p ? p.uid : '';
            }
        }
        else {
            let p = this._gameData.players[1];
            return p ? p.uid : '';
        }
    }

    public getPlayer(playerId: number): IGamePlayer {
        if (!this._gameData || !this._gameData.players) {
            return null;
        }
        for (let i = 0; i < this._gameData.players.length; ++i) {
            let p = this._gameData.players[i];
            if (p.playerId == playerId) {
                return p;
            }
        }
        return null;
    }

    private getPlayerIndex(userId: string): number {
        for (let i = 0; i < this._gameData.players.length; ++i) {
            if (this._gameData.players[i].uid == userId) {
                return i;
            }
        }
        return -1;
    }

    // ============= MESSAGE HANDLER ============
    /**
     * This message will arrive before login result.
     * 这个消息会在登录成功返回之前收到。
    */
    onNet_GameDataSyncPush(msg: MsgGameDataSyncPush) {
        this._gameData = msg.data;
        this._gameData.players.forEach(v => {
            this._playerMap[v.playerId] = v;
            if (v.uid == UserMgr.inst.uid) {
                this._selfPlayer = v;
            }
        });
        this._gameStateEndTime = this._gameData.gameStateRemainingTime + Date.now();
    }

    onNet_GameDataChangedPush(msg: MsgGameDataChangedPush) {
        if (!this._gameData) {
            return;
        }

        if (msg.gameState != undefined) {
            this._gameData.gameState = msg.gameState;
        }

        if (msg.gameStateRemainingTime != undefined) {
            this._gameData.gameStateRemainingTime = msg.gameStateRemainingTime;
            this._gameStateEndTime = this._gameData.gameStateRemainingTime + Date.now();
        }

        if (msg.teamWeights != undefined) {
            for (let teamId in msg.teamWeights) {
                let score = msg.teamWeights[teamId];
                this._gameData.teamsWeights[teamId] = score;
            }
        }

        director.emit(GameEvent.GAME_DATA_CHANGED, msg);
    }

    onNet_PlayerComesPush(msg: MsgPlayerComesPush) {
        this._gameData.players.push(msg.player);
        this._playerMap[msg.player.playerId] = msg.player;
        if (msg.player.uid == UserMgr.inst.uid) {
            this._selfPlayer = msg.player;
        }
        director.emit(GameEvent.PLAYER_COMES, msg.player);
    }

    onNet_PlayerDataChangedPush(msg: MsgPlayerDataChangedPush) {
        let p = this.getPlayer(msg.playerId);
        if (!p) {
            return;
        }

        for(let k in msg){
            p[k] = msg[k];
        }

        if (msg.reviveTime != undefined) {
            if (msg.reviveTime > 0) {
                director.emit(GameEvent.PLAYER_DIE, p);
            }
            else {
                director.emit(GameEvent.PLAYER_REVIVE, p);
            }
        }

        director.emit(GameEvent.PLAYER_DATA_CHANGED, msg);
    }

    onNet_PlayerLeavesPush(msg: MsgPlayerLeavesPush) {
        for (let i = 0; i < this._gameData.players.length; ++i) {
            let p = this._gameData.players[i];
            if (p.uid == msg.uid) {
                this._gameData.players.splice(i, 1);
                delete this._playerMap[p.playerId];
                director.emit(GameEvent.PLAYER_LEAVES, p);
                break;
            }
        }
    }

    onNet_GameBeginPush(msg: MsgGameBeginPush) {
        if (!this._gameData) {
            return;
        }

        this._gameData.players.forEach(v => {
            //v.color = '';
        });

        director.emit(GameEvent.GAME_BEGIN);
    }

    onNet_GameOverPush(msg: MsgGameOverPush) {
        director.emit(GameEvent.GAME_OVER, msg);
    }

    onNet_CellDataChange(msg: MsgCellDataChange) {
        let p = this.getPlayer(msg.playerId);
        for(let k in msg){
            p[k] = msg[k];
        }
        director.emit(GameEvent.CELL_DATA_CHANGED, msg);
    }

    onNet_FoodEatenPush(msg: MsgFoodEatenPush) {
        for (let i = 0; i < msg.eatenFoods.length; i++) {
            let foodId = msg.eatenFoods[i];
            delete this._gameData.foodList[foodId];
        }
        director.emit(GameEvent.FOOD_EATEN, msg);
    }

    onNet_FoodAddedPush(msg: MsgFoodAddedPush) {
        for (let i = 0; i < msg.foods.length; ++i) {
            let fd = msg.foods[i];
            this._gameData.foodList[fd.id] = fd;
        }
        director.emit(GameEvent.FOOD_ADDED, msg);
    }
}

GameMgr.inst;