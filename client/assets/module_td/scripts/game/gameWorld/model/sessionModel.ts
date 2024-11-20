import { ECSWorld } from '../ecs/ECSWorld';

export class SessionModel {
  static readonly sessionWorld = new ECSWorld(1000);
}
