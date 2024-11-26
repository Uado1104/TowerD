import { ObservableModel } from '../../../core/model/observableModel';
import { ECSWorld } from '../ecs/ECSWorld';

export interface IGameModel {
  EnemyAliveCount: number;
}

class CGameModel extends ObservableModel<IGameModel> {
  constructor() {
    super({
      EnemyAliveCount: 0,
    });
  }
}

export class GameModel {
  static readonly gameWorld = new ECSWorld(1000);

  static data = new CGameModel();
}
