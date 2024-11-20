import { EventDispatcher, TEventDefine } from '../../../core/events/eventSystem';

const gameStateEventDefine: TEventDefine = {
  onRoundStart: () => {},
  onRoundEnd: () => {},
  onWaveStart: () => {},
  onWaveEnd: () => {},
};

export class GamePlayStateManager {
  static event = new EventDispatcher<typeof gameStateEventDefine>();
}
