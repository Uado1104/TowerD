export interface GameEnemySim {
  /** 怪物Id */
  monsterId: number;

  /** 怪物生成时的在地图上id */
  createIdOnMap: number;

  /** 怪物数量 */
  count: number;

  /** 生成间隔，为0时全部一起生成 */
  genInterval: number;
}

export interface GameWaveSim {
  /** 序号 */
  index: number;

  /** 怪物 */
  enemies: GameEnemySim[];
}

export interface GameRoundSim {
  /** 抽牌阶段 */
  drawPhase: boolean;

  /** 序号 */
  index: number;

  /** 当前波数 */
  currentWave: number;

  /** 怪物波数 */
  waves: GameWaveSim[];
}

export interface GameSessionSim {
  /** 当前回合 */
  currentRound: number;
  /** 怪物回合 */
  rounds: GameRoundSim[];
}

export interface GamePlayerSim {
  /** 玩家Id */
  playerId: number;

  /** 玩家等级 */
  level: number;

  /** 放置在场上的 */
  heros: number[];
}

export interface GameCardSim {
  /** 卡牌Id */
  cardId: number;

  /** 卡牌数量 */
  count: number;

  /** 卡牌等级 */
  level: number;
}

export interface GameRoomSim {
  /** 局内数据 */
  session: GameSessionSim;

  /** 玩家数据 */
  players: GamePlayerSim[];

  /** 牌池 */
  cardPool: number[];
}
