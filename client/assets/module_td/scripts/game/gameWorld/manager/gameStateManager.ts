import { EventDispatcher, TEventDefineType } from '../../../core/events/eventSystem';

const gameStateEventDefine = {
  pause: () => {},
  resume: () => {},
};

export class GamePlayStateManager {
  static event = new EventDispatcher<typeof gameStateEventDefine>();
}
