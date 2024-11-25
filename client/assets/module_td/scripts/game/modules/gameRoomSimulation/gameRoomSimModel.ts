import { Logger } from '../../../core/debugers/log';
import { GameRoomSim, GameSessionSim } from './gameRoomSimInterface';

export class GameRoomSimModel {
  constructor() {
    Logger.log('GameRoomSimModel', 'GameRoomSimModel constructor');
  }

  private myData: GameRoomSim | undefined;

  init(data: GameRoomSim) {
    this.myData = data;
  }

  get data(): GameRoomSim {
    if (!this.myData) {
      Logger.error('GameRoomSimModel', 'data is undefined');
      throw new Error('data is undefined');
    }
    return this.myData;
  }

  /** 换一批卡牌 */
  drawCard() {}

  /** 选择一张卡 */
  pickCard() {}

  enemyAliveCount = 0;

  get CurrentBattleOver(): boolean {
    return this.enemyAliveCount > 0;
  }

  waveLeft = 0;

  roundLeft = 0;
}
