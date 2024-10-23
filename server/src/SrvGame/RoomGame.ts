import { BaseConnection, MsgCall } from "tsrpc";
import { ServiceType } from "../shared/protocols/serviceProto_public";
import { GameUserData, Room } from "./Room";
import { MsgCellDataChange } from "../shared/protocols/public/game/MsgCellDataChange";
import { GameClientConn } from "../common/WebsocketGameServer";
import { AI_NAMES, REGIONS } from "./AIFakeData";
import { TokenUtils } from "../common/TokenUtils";
import { TEAM_ID_ARR } from "../shared/types/TeamInfo";
import { MasterSrvRPC } from "../SrvMaster/MasterSrvRPC";
import { Food } from "./Food";
import { GameData } from "./GameData";
import { GamePlayer } from "./GamePlayer";
import { GameConstants } from "./GameConstants";
import { ServerGlobals } from "../common/ServerGloabls";

class MapGrid {
    public foods = new Map<number, Food>();
    public players = new Map<number, GamePlayer>();
    public addObj(obj: Food | GamePlayer): void {
        if (obj instanceof GamePlayer) {
            this.players.set(obj.playerId, obj);
        }
        else {
            this.foods.set(obj.id, obj);
        }
    }

    public removeObj(obj: Food | GamePlayer) {
        if (obj instanceof GamePlayer) {
            this.players.delete(obj.playerId);
        }
        else {
            this.foods.delete(obj.id);
        }
    }
}

export class RoomGame extends Room {

    private _gameData: GameData = new GameData();

    private _foodPool: Food[] = [];

    private _mapGrids: MapGrid[] = [];

    public callInGrids(obj: GamePlayer, cb: (mapGrid: MapGrid) => void) {
        let halfMapWidth = GameConstants.MAP_WIDTH / 2;
        let halfMapHeight = GameConstants.MAP_HEIGHT / 2;
        let left = Math.max(0, Math.floor((obj.x - obj.radius + halfMapWidth) / GameConstants.MAP_GRID_SIZE));
        let right = Math.min(GameConstants.MAP_WIDTH_GRID, Math.ceil((obj.x + obj.radius + halfMapWidth) / GameConstants.MAP_GRID_SIZE));
        let top = Math.max(0, Math.floor((obj.y - obj.radius + halfMapHeight) / GameConstants.MAP_GRID_SIZE));
        let bottom = Math.min(GameConstants.MAP_HEIGHT_GRID, Math.ceil((obj.y + obj.radius + halfMapHeight) / GameConstants.MAP_GRID_SIZE));
        for (let i = left; i <= right; ++i) {
            for (let j = top; j <= bottom; ++j) {
                let gridIndex = j * GameConstants.MAP_WIDTH_GRID + i;
                let mapGrid = this._mapGrids[gridIndex];
                if (cb) {
                    cb(mapGrid);
                }
            }
        }
    }

    public putObjectToGrid(obj: Food | GamePlayer) {
        let halfMapWidth = GameConstants.MAP_WIDTH / 2;
        let halfMapHeight = GameConstants.MAP_HEIGHT / 2;
        let left = Math.max(0, Math.floor((obj.x - obj.radius + halfMapWidth) / GameConstants.MAP_GRID_SIZE));
        let right = Math.min(GameConstants.MAP_WIDTH_GRID, Math.ceil((obj.x + obj.radius + halfMapWidth) / GameConstants.MAP_GRID_SIZE));
        let top = Math.max(0, Math.floor((obj.y - obj.radius + halfMapHeight) / GameConstants.MAP_GRID_SIZE));
        let bottom = Math.min(GameConstants.MAP_HEIGHT_GRID, Math.ceil((obj.y + obj.radius + halfMapHeight) / GameConstants.MAP_GRID_SIZE));
        let index = 0;
        let dirty = false;
        for (let i = left; i <= right; ++i) {
            for (let j = top; j <= bottom; ++j) {
                let gridIndex = j * GameConstants.MAP_WIDTH_GRID + i;
                if (obj.gridsIndex[index] != gridIndex) {
                    dirty = true;
                    break;
                }
                index++;
            }
        }

        if (dirty) {
            obj.gridsIndex.forEach(gridIndex => {
                this._mapGrids[gridIndex].removeObj(obj);
            });

            let cnt = 0;
            for (let i = left; i <= right; ++i) {
                for (let j = top; j <= bottom; ++j) {
                    let gridIndex = j * GameConstants.MAP_WIDTH_GRID + i;
                    obj.gridsIndex[cnt] = gridIndex;
                    this._mapGrids[gridIndex].addObj(obj);
                    cnt++;
                }
            }
            obj.gridsIndex.length = cnt;
        }
    }

    /**
     * @en player id mapping table, used for fast index.
     * @zh 玩家 id 映射表，用于快速索引玩家数据。
     */
    protected _playerMap: { [key: number]: GamePlayer } = {};

    private _instIdBase = 1;

    constructor(id: string, gameType: string, displayId: string, name: string, password?: string) {
        super(id, gameType, displayId, name, password);
        this.roomData.maxUser = GameConstants.MAX_TEAM_NUM * GameConstants.TEAM_MEMMBER_NUM;
        this.roomData.maxPlayerNum = GameConstants.MAX_TEAM_NUM * GameConstants.TEAM_MEMMBER_NUM;

        let gridNum = (GameConstants.MAP_WIDTH_GRID + 1) * (GameConstants.MAP_HEIGHT_GRID + 1);
        for (let i = 0; i < gridNum; ++i) {
            this._mapGrids.push(new MapGrid());
        }

        for (let i = 0; i < GameConstants.MAX_TEAM_NUM; ++i) {
            while (true) {
                let teamId = TEAM_ID_ARR[Math.floor(Math.random() * TEAM_ID_ARR.length)];
                if (this._gameData.teamsWeights[teamId] == undefined) {
                    this._gameData.teamsWeights[teamId] = GameConstants.TEAM_MEMMBER_NUM * GameConstants.PLAYER_ORGINAL_WEIGHT;
                    for (let j = 0; j < GameConstants.TEAM_MEMMBER_NUM; ++j) {
                        this._gameData.teamSlots.push(teamId);
                    }
                    break;
                }
            }
        }

        //随机打乱
        this._gameData.teamSlots.sort((a, b) => { return Math.random() - 0.5 });

        //随机生成食物
        for (let i = 0; i < GameConstants.FOOD_MAX_NUM; ++i) {
            this.genRandomFood();
        }
    }

    genRandomFood() {
        let food = this._foodPool.pop();
        if (!food) {
            food = new Food();
        }

        food.id = this._instIdBase++;
        //@en random food type @zh 随机一个食物类型
        food.type = Math.floor(Math.random() * GameConstants.FOOD_TYPE_NUM);
        //@en random food color @zh 随机一个食物颜色
        food.color = GameConstants.FOOD_COLORS[Math.floor(Math.random() * GameConstants.FOOD_COLORS.length)];

        //@en set food's weight @zh 设定食物重量
        let weight = GameConstants.FOOD_SMALL_WEIGHT;

        //@en check if it needs to generate big food @zh 判断是否需要生成大食物
        if (Math.random() < GameConstants.FOOD_BIG_PROBABLITY) {
            weight = GameConstants.FOOD_BIG_WEIGHT;
        }
        food.weight = weight;
        //@en calculate fodd's radius @zh 计算食物的半径
        food.radius = Math.sqrt(weight / GameConstants.QUICK_CAL_FACTOR);

        //@en random position @zh 随机位置
        let width = GameConstants.MAP_WIDTH - food.radius * 2;
        let height = GameConstants.MAP_HEIGHT - food.radius * 2;
        food.x = Math.random() * width - width / 2;
        food.y = Math.random() * height - height / 2;

        this._gameData.foodList[food.id] = food;
        this.putObjectToGrid(food);
        return food;
    }

    listenMsgs(conn: GameClientConn) {
        super.listenMsgs(conn);
        conn.listenMsg("game/CellDataChange", call => { this.onMsg_CellDataChange(call); });
    }
    onMsg_CellDataChange(call: MsgCall<MsgCellDataChange, ServiceType>) {
        if (this._gameData.gameState != 'playing') {
            return;
        }
        let player = this.getPlayerByConn(call.conn);
        if (!player) {
            return;
        }
        let trans = call.msg.transform;
        if (trans) {
            let dx = player.x - trans[0];
            let dy = player.y - trans[1];
            let dz = player.z - trans[2];
            let distSqr = dx * dx + dy * dy + dz * dz;
            let maxStepDist = player.speed * GameConstants.PLAYER_MOVEMENT_BIAS_FACTOR;
            if (distSqr <= maxStepDist * maxStepDist) {
                player.transform = trans;
                //广播给其他玩家 bradcast to other players
                let rotation = player.rotation;
                player.dirX = Math.cos(rotation / 180 * Math.PI);
                player.dirY = Math.sin(rotation / 180 * Math.PI);
                player.state = 'moving';
                call.msg.state = player.state;
                call.msg.playerId = player.playerId;
                this.broadcastMsg("game/CellDataChange", call.msg);
            }
            else {
                player.rotation = trans[3];
                //illegal posotion, force using position data.
                //数据不合法，强行同步位置
                call.conn.sendMsg("game/CellDataChange", { playerId: player.playerId, transform: player.transform, forceSync: true });
            }
        }
    }

    unlistenMsgs(conn: GameClientConn) {
        super.unlistenMsgs(conn);
        conn.unlistenMsgAll("game/CellDataChange");
    }

    onUserEnter(conn?: GameClientConn) {
        if (conn) {
            this._gameData.gameStateRemainingTime = Math.max(0, this._gameData.curStateEndTime - Date.now());
            conn.sendMsg("game/GameDataSyncPush", { data: this._gameData });
        }
    }

    onPlayerLeave(conn: GameClientConn) {
        for (let i = 0; i < this._gameData.players.length; ++i) {
            let p = this._gameData.players[i];
            if (p.uid == conn.uid) {
                this._gameData.players.splice(i, 1);
                delete this._playerMap[p.playerId];
                this.broadcastMsg("game/PlayerLeavesPush", { uid: p.uid });
                break;
            }
        }
    }

    onJoinGame(newUser: GameUserData, roleName: string) {

        if (this._roomData.isPlaying) {
            return 0;
        }

        let newPlayer = new GamePlayer();
        newPlayer.uid = newUser.uid;
        newPlayer.roleName = roleName;
        newPlayer.color = Math.floor(Math.random() * 0xffffff);
        newPlayer.playerId = this._instIdBase++;
        newPlayer.weight = GameConstants.PLAYER_ORGINAL_WEIGHT;
        newPlayer.radius = GameConstants.PLAYER_ORGINAL_RADIUS;
        newPlayer.speed = GameConstants.PLAYER_ORGINAL_SPEED;
        newPlayer.isAI = !!newUser.isAI;
        newPlayer.teamId = this._gameData.teamSlots.pop()!;
        newPlayer.state = newUser.isAI ? 'moving' : '';

        if (newUser.isAI) {
            let region = REGIONS[Math.floor(Math.random() * REGIONS.length)];
            newPlayer.location = region;
        }

        this.randomPosition(newPlayer);

        //add to player list
        this._gameData.players.push(newPlayer);
        this._playerMap[newPlayer.playerId] = newPlayer;
        this._roomData.playerNum = this._gameData.players.length;

        this.broadcastMsg("game/PlayerComesPush", { player: newPlayer });
        return newPlayer.playerId;
    }

    changeGameState(state: "waiting" | "counting" | "playing" | "gameover") {
        this._gameData.gameState = state;
        this._gameData.gameStateRemainingTime = GameConstants.GAME_STATE_DURATION[state];
        this._gameData.curStateStartTime = Date.now();
        this._gameData.curStateEndTime = Date.now() + this._gameData.gameStateRemainingTime;
        this._gameData.lastSyncStateTime = Date.now();
        this.broadcastMsg("game/GameDataChangedPush", { gameState: this._gameData.gameState, gameStateRemainingTime: this._gameData.gameStateRemainingTime });
        if (state == 'gameover') {
            let rpc = MasterSrvRPC.get();
            let uidArr = this._gameData.players.map(v => { return v.uid });
            MasterSrvRPC.get().updateUserLocation(uidArr, { serverUrl: ServerGlobals.options.internalUrl, roomId: '', gameType: '' });
        }
    }

    syncGameStateRemainingTime() {
        if (Date.now() - this._gameData.lastSyncStateTime < 15000) {
            return;
        }
        this._gameData.lastSyncStateTime = Date.now();
        this._gameData.gameStateRemainingTime = Math.max(0, this._gameData.curStateEndTime - Date.now());
        this.broadcastMsg("game/GameDataChangedPush", { gameStateRemainingTime: this._gameData.gameStateRemainingTime });
    }

    onCheckGameBegin() {
        if (this._gameData.players.length >= this._roomData.maxPlayerNum) {
            let elapsedTime = Date.now() - this._gameData.curStateStartTime;
            if (elapsedTime < GameConstants.MAX_WAIT_READY_TIME) {
                for (let i = 0; i < this.roomData.userList.length; ++i) {
                    let user = this.roomData.userList[i];
                    if (user.playerId && !user.ready) {
                        return;
                    }
                }
            }
            this.setPlaying(true);
            this.broadcastMsg("room/RoomDataChangedPush", { isPlaying: this.roomData.isPlaying });
            this.changeGameState("counting");
        }
    }

    /**
     * @en get player by connection.
     * @zh 根据连接获取玩家
     * @param conn connection object / 连接对象
     * @returns player object, null if not found / 玩家对象，如果找不到则返回 null
     */
    getPlayerByConn(conn: BaseConnection<ServiceType>) {
        let uid = (conn as GameClientConn).uid;
        if (!uid) {
            return null;
        }

        return this.getPlayer(uid);
    }

    /***
 * @en get player by uid, null if not found.
 * @zh 通过 uid 查找对应的玩家, null 表示不是玩家
 */
    getPlayer(uid: string) {
        let user = this._userMap.get(uid);
        if (!user || !user.playerId) {
            return;
        }
        return this._playerMap[user.playerId];
    }

    gameOver() {
        this.changeGameState("gameover");
        this.setPlaying(false);
        let winnerTeam = 0;
        let maxWeight = 0;
        for (let teamId in this._gameData.teamsWeights) {
            let teamWeight = this._gameData.teamsWeights[teamId];
            if (maxWeight < teamWeight) {
                maxWeight = teamWeight;
                winnerTeam = Number(teamId);
            }
        }
        this.broadcastMsg("room/RoomDataChangedPush", { isPlaying: this._roomData.isPlaying });
        this.broadcastMsg("game/GameOverPush", { winner: winnerTeam });
    }

    checkLiveAndDoRevive(player: GamePlayer, needBroadcast?: boolean) {
        if (player && player.deadTimestamp > 0) {
            player.reviveTime = player.deadTimestamp + GameConstants.REVIVIE_CD - Date.now();
            if (player.reviveTime <= 0) {
                player.reviveTime = 0;
                player.deadTimestamp = 0;
                this.randomPosition(player);
                player.protectedTime = Date.now() + GameConstants.PROTECT_TIME;
                if (needBroadcast) {
                    this.broadcastMsg("game/CellDataChange", { playerId: player.playerId, transform: player.transform, forceSync: true, protectedTime: player.protectedTime });
                    this.broadcastMsg("game/PlayerDataChangedPush", { playerId: player.playerId, reviveTime: player.reviveTime });
                }
            }
        }
    }

    randomPosition(player: GamePlayer) {
        let width = GameConstants.MAP_WIDTH - player.radius * 2;
        let height = GameConstants.MAP_HEIGHT - player.radius * 2;
        player.x = Math.random() * width - width / 2;
        player.y = Math.random() * height - height / 2;
        player.z = 0;
        player.rotation = Math.random() * 360;
        if (player.isAI) {
            this.randomDirection(player);
        }
    }

    randomDirection(player: GamePlayer) {
        let rotation = player.rotation = Math.random() * 360;
        player.dirX = Math.cos(rotation / 180 * Math.PI);
        player.dirY = Math.sin(rotation / 180 * Math.PI);
    }

    recalculateRadiusAndSpeed(p: GamePlayer) {
        p.radius = Math.sqrt(p.weight / GameConstants.QUICK_CAL_FACTOR);
        p.speed = GameConstants.PLAYER_ORGINAL_SPEED - ((p.weight - GameConstants.PLAYER_ORGINAL_WEIGHT) / p.weight);
    }

    lastGenFood: number = 0;
    lastAddAITime: number = 0;

    onUpdate(deltaTime: number): void {
        if (this._gameData.gameState == 'waiting') {
            this.onUpdate_Waiting(deltaTime);
        }
        else if (this._gameData.gameState == 'counting') {
            this.onUpdate_Counting(deltaTime);
        }
        else if (this._gameData.gameState == "playing") {
            this.onUpdate_Playing(deltaTime);
        }
        else if (this._gameData.gameState == "gameover") {
            this.onUpdate_GameOver(deltaTime);
        }
    }

    onUpdate_Waiting(deltaTime: number) {
        if (Date.now() - this._gameData.curStateStartTime > GameConstants.DELAY_ADD_AI_TIME && Date.now() - this.lastAddAITime > 100) {
            this.lastAddAITime = Date.now();
            if (this._gameData.players.length < this._roomData.maxPlayerNum) {
                let userName = AI_NAMES[Math.floor(Math.random() * AI_NAMES.length)];
                let roleName = AI_NAMES[Math.floor(Math.random() * AI_NAMES.length)];
                let uid = '' + TokenUtils.genID(7, true);
                let aiUser = {
                    uid: uid,
                    name: userName,
                    visualId: Math.floor(Math.random() * 4),
                    isAI: true,
                    isOnline: true,
                    gender: Math.floor(Math.random() * 2) + 1,
                    ready: true,
                };
                while (true) {
                    let suc = this.enterAI(aiUser, roleName);
                    if (suc) {
                        break;
                    }
                    //renew uid and try again.
                    aiUser.uid = '' + TokenUtils.genID(7, true);
                }
            }
        }

        this.onCheckGameBegin();
    }

    onUpdate_Counting(deltaTime: number) {
        let time = this._gameData.curStateEndTime - Date.now();
        if (time <= 0) {
            this.changeGameState("playing");
        }
    }

    onUpdate_Playing(deltaTime: number) {
        let time = this._gameData.curStateEndTime - Date.now();
        if (time <= 0) {
            if (this._gameData.gameState == "playing") {
                this.gameOver();
                return;
            }
        }

        this.syncGameStateRemainingTime();

        let changedTeams: { [key: number]: number } | undefined;
        let changeTeamScore = (teamId: number, deltaScore: number) => {
            if (deltaScore == 0) {
                return;
            }

            if (!changedTeams) {
                changedTeams = {}
            }
            changedTeams[teamId] = this._gameData.teamsWeights[teamId] += deltaScore;
        }

        let eatenFoods: number[] = [];
        //update all players position
        this._gameData.players.forEach(p => {
            let player = p as GamePlayer;
            this.checkLiveAndDoRevive(player, true);

            if (player.deadTimestamp > 0) {
                return;
            }
            this.updatePlayerMovement(deltaTime, player);
        });
        this._gameData.players.forEach(p => {
            let player = p as GamePlayer;
            if (player.deadTimestamp > 0) {
                return;
            }

            let changedProps: MsgCellDataChange | undefined = undefined;
            if (player.protectedTime > 0 && Date.now() > player.protectedTime) {
                player.protectedTime = 0;
                if (!changedProps) {
                    changedProps = { playerId: player.playerId };
                }
                changedProps.protectedTime = player.protectedTime;
            }

            this.callInGrids(player, mapGrid => {
                let dirty = false;
                mapGrid.players.forEach(targetCell => {
                    //check wether this player can eat the other one
                    //skip when it's self || alive || radius less than the target cell || target cell is proctected
                    if (player == targetCell || player.teamId == targetCell.teamId || targetCell.deadTimestamp > 0 || player.radius <= targetCell.radius || targetCell.protectedTime - Date.now() > 0) {
                        return;
                    }
                    let dx = player.x - targetCell.x;
                    let dy = player.y - targetCell.y;
                    let gap = (player.radius - targetCell.radius) * 1.2;
                    if (dx * dx + dy * dy < gap * gap) {
                        //eat
                        targetCell.deadTimestamp = Date.now();
                        targetCell.reviveTime = GameConstants.REVIVIE_CD;
                        let remainingWeight = Math.floor(targetCell.weight / 2);
                        if (remainingWeight < GameConstants.PLAYER_ORGINAL_WEIGHT) {
                            remainingWeight = GameConstants.PLAYER_ORGINAL_WEIGHT;
                        }
                        let transferWeight = targetCell.weight - remainingWeight;
                        targetCell.weight = remainingWeight;
                        changeTeamScore(targetCell.teamId, -transferWeight);
                        this.recalculateRadiusAndSpeed(targetCell);

                        this.broadcastMsg("game/CellDataChange", { playerId: targetCell.playerId, weight: targetCell.weight, radius: targetCell.radius, speed: targetCell.speed });
                        this.broadcastMsg("game/PlayerDataChangedPush", { playerId: targetCell.playerId, reviveTime: targetCell.reviveTime });

                        player.weight += transferWeight;
                        changeTeamScore(player.teamId, transferWeight);

                        dirty = true;
                    }
                });

                mapGrid.foods.forEach(food => {
                    let dist2 = (player.radius + food.radius) * (player.radius + food.radius);
                    let dx = player.x - food.x;
                    let dy = player.y - food.y;
                    if (dx * dx + dy * dy < dist2) {
                        player.weight += food.weight;
                        changeTeamScore(player.teamId, food.weight);
                        eatenFoods.push(food.id);
                        delete this._gameData.foodList[food.id];
                        this._foodPool.push(food);
                        food.gridsIndex.forEach(gridIndex => {
                            this._mapGrids[gridIndex].removeObj(food);
                        });
                        dirty = true;
                    }
                });

                if (dirty) {
                    this.recalculateRadiusAndSpeed(player);
                    //
                    if (!changedProps) {
                        changedProps = { playerId: player.playerId };
                    }
                    changedProps.protectedTime = player.protectedTime;
                    changedProps.weight = player.weight;
                    changedProps.radius = player.radius;
                    changedProps.speed = player.speed;
                }

                if (changedProps) {
                    this.broadcastMsg("game/CellDataChange", changedProps);
                }
            });
        });

        if (eatenFoods.length > 0) {
            this.broadcastMsg("game/FoodEatenPush", { eatenFoods: eatenFoods });
        }

        if (changedTeams) {
            this.broadcastMsg("game/GameDataChangedPush", { teamWeights: changedTeams });
        }

        if (Date.now() - this.lastGenFood > 1000) {
            let newFoods = [];
            for (let i = 0; i < 50; i++) {
                if (this._foodPool.length == 0) {
                    break;
                }
                newFoods.push(this.genRandomFood());
            }
            if (newFoods.length > 0) {
                this.broadcastMsg("game/FoodAddedPush", { foods: newFoods });
            }
            this.lastGenFood = Date.now();
        }
    }

    onUpdate_GameOver(delTime: number) {
        let time = this._gameData.curStateEndTime - Date.now();
        if (time <= 0) {
            console.log('room:', this._roomData.id, ' is closed.');
            this.destroy();
        }
    }

    updatePlayerMovement(deltaTime: number, player: GamePlayer) {
        if (player.state != 'moving') {
            return;
        }

        const halfWidth = GameConstants.MAP_WIDTH / 2 - player.radius;
        const halfHeight = GameConstants.MAP_HEIGHT / 2 - player.radius;
        let dt = deltaTime / 1000;

        let x = player.x + player.dirX * player.speed * dt;
        let y = player.y + player.dirY * player.speed * dt;
        let hitEdge = false;
        if (x < -halfWidth) {
            x = -halfWidth;
            hitEdge = true;
        }
        if (x > halfWidth) {
            x = halfWidth;
            hitEdge = true;
        }
        if (y < -halfHeight) {
            y = -halfHeight;
            hitEdge = true;
        }
        if (y > halfHeight) {
            y = halfHeight;
            hitEdge = true;
        }

        player.x = x;
        player.y = y;

        this.putObjectToGrid(player);

        if (player.isAI) {
            //if the ai hit the boundaries, or it moves for enough period, it has chance to change the direction.
            //如果撞到边界，或者超出时长，则有一定机率更换方向。
            if (hitEdge || (Date.now() - player.lastChangeDirTime > 3000 && Math.random() > 0.9)) {
                player.lastChangeDirTime = Date.now();
                this.randomDirection(player);
                this.broadcastMsg("game/CellDataChange", { playerId: player.playerId, transform: player.transform });
            }
        }
    }
}