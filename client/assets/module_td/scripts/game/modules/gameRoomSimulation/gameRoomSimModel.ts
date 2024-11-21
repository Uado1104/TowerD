import { produce } from 'immer';
import { Logger } from '../../../core/debugers/log';
import { GameSessionSim } from './gameRoomSimInterface';

export class GameRoomSimModel {
  constructor() {
    Logger.log('GameRoomSimModel', 'GameRoomSimModel constructor');
  }

  private myData: GameSessionSim | undefined;

  init(data: GameSessionSim) {
    this.myData = data;
  }

  get data(): GameSessionSim {
    if (!this.myData) {
      Logger.error('GameRoomSimModel', 'data is undefined');
      throw new Error('data is undefined');
    }
    return produce(this.myData, (draft) => {});
  }

  /** 抽一张卡 */
  drawCard() {}

  /** 选择一张卡 */
  pickCard() {}

  

}
