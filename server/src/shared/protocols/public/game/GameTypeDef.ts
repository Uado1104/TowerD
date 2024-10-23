/**
 * @en player data of game
 * @zh 游戏玩家数据
*/
export interface IGamePlayer {
    /**
     * @en user id, corresponding to the uid in database
     * @zh 用户 id，对应数据库中的 uid 
    */
    uid: string,
    /**
     * @zh the color of player, used to distinguish different camp
     * @zh 玩家颜色，用于区别不同阵营
    */
    color: number,
    /**
     * @en player id, use playerId instead of uid, because playerId in number type is more bandwidth-saving
     * @zh 玩家唯一 id。游戏逻辑使用 playerId 而不是 uid，因为 playerId 更省带宽
    */
    playerId: number,
    /**
     * @en properties of game play
     * @zh 游戏逻辑相关属性
    */
    roleName: string,
    location: string,
    //x,y,z,rotation
    transform: number[],
    /**
     * @en <= 0: alive, > 0: dead
     * @zh 复活时间 <= 0 活着 > 0 死亡
    */
    reviveTime: number,

    protectedTime: number,

    weight: number,
    radius: number,
    speed: number,
    teamId: number,
    state: '' | 'moving'
}

export interface IFood {
    /**
     * @en food id
     * @zh 食物 ID
    */
    id: number,
    /**
     * @en food x coordinate
     * @zh 食物坐标 X
     */
    x: number,
    /**
     * @en food y coordinate
     * @zh 食物坐标 Y
    */
    y: number,

    /**
     * @en food type, currently only determines appearance
     * @zh 食物类型，目前只决定外观
    */
    type: number,

    color: number,

    /**
     * @en food's weight
     * @zh 食物重量
     */
    radius: number,
}

/**
 * @en game data
 * @zh 游戏数据
*/
export interface IGameData {
    /**
     * @en default player's cell radius
     * @zh 玩家默认半径
    */
    defaultPlayerCellRadius: number,

    /**
     * @en width of map
     * @zh 地图宽度 
    */
    mapWidth: number,

    /**
     * @en height of map
     * @zh 地图高度
    */
    mapHeight: number,
    /**
     * @en game state
     * @zh 游戏状态   等待加入，倒计时开始，游戏中，倒计时结束，
     */
    gameState: "waiting" | "counting" | "playing" | "gameover",
    /**
     * @en current remaining time of game state
     * @zh 当前游戏状态剩余时间
    */
    gameStateRemainingTime: number,
    /**
     * @en the player list of the game
     * @zh 参与游戏的玩家列表
    */
    players: IGamePlayer[],
    /**
     * @en all food in the game
     * @zh 食物列表
    */
    foodList: { [key: number]: IFood },

    /**
     * @en record the score teams in this game
     * @zh 记录本场比赛队伍的重量
    */
    teamsWeights: { [key: number]: number },
}