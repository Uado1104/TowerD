import { ECSWorld } from '../ecs/ECSWorld';

export class GameModel {
  static readonly gameEcsWorld = new ECSWorld(10000);
}
