import { EventDispatcher } from '../../core/events/eventSystem';

const uiEventDefine = {
  onKillEnemy: () => {},
};

export class UiManager {
  static event = new EventDispatcher<typeof uiEventDefine>();
}
