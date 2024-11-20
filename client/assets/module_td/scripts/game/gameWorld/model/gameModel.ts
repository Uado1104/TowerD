import { ECSWorld } from '../ecs/ECSWorld';

export class GameModel {
  static readonly gameWorld = new ECSWorld(1000);
}
