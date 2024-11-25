import { DEvent } from '../../../core/events/DEvent';
import { EventDispatcher, TEventHandleParams } from '../../../core/events/eventSystem';
import { TickSystem } from '../../../core/ticker/TickerSystem';

const gameStrategyEventDefine = {
  startGame: () => {},
  onRoundStart: (round: number) => {},
  onRoundEnd: () => {},
  onWaveStart: () => {},
  onWaveEnd: () => {},
  onDrawCard: () => {},
  onEndDrawCard: () => {},
};

export type TStrategyDefine = typeof gameStrategyEventDefine;

export type TCommand = keyof TStrategyDefine;

export abstract class IGamePlayStrategyBase {
  abstract onHandleCommand(command: TCommand, ...params: TEventHandleParams<TStrategyDefine[TCommand]>): void;

  excute<T extends TCommand>(command: T, ...params: TEventHandleParams<TStrategyDefine[TCommand]>) {
    const evt = DEvent.create(command, params);
    this.needHandle.push(evt);
    TickSystem.CallNextFrame(this.handleCommandInternal, this);
  }

  private readonly needHandle: DEvent[] = [];

  private handleCommandInternal() {
    for (const evt of this.needHandle) {
      this.onHandleCommand(
        evt.type as TCommand,
        ...(evt.data as unknown as TEventHandleParams<TStrategyDefine[TCommand]>),
      );
      DEvent.backToPool(evt);
    }
    this.needHandle.length = 0;
  }

  readonly event = new EventDispatcher<typeof gameStrategyEventDefine>();
}
