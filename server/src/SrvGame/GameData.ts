import { IFood, IGameData, IGamePlayer } from "../shared/protocols/public/game/GameTypeDef";
import { GameConstants } from "./GameConstants";

export class GameData implements IGameData {
    defaultPlayerCellRadius = GameConstants.PLAYER_ORGINAL_RADIUS;
    mapWidth = GameConstants.MAP_WIDTH;
    mapHeight = GameConstants.MAP_HEIGHT;
    gameState: "waiting" | "counting" | "playing" | "gameover" = "waiting";
    gameStateRemainingTime = 0;
    players: IGamePlayer[] = [];
    foodList: { [key: number]: IFood } = {};
    curStateEndTime = Date.now();
    curStateStartTime = Date.now();
    teamsWeights: { [key: number]: number } = {};
    teamSlots: number[] = [];
    lastSyncStateTime = Date.now();
}