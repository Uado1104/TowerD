import { DEvent } from '../../../core/events/DEvent';
import { EventDispatcher, TEventDefine, TEventHandle, TEventHandleParams } from '../../../core/events/eventSystem';
import { TickSystem } from '../../../core/ticker/TickerSystem';

export const gameCommandList = ['getSessionConfig'] as const;

export type TCommand = (typeof gameCommandList)[number];

const gameplayStrategyDefine: Record<TCommand, TEventHandle> = {
  getSessionConfig: (session: number) => {},
};

export type TStrategyDefine = typeof gameplayStrategyDefine;

const gameStrategyEventDefine: TEventDefine = {
  onRoundStart: () => {},
  onRoundEnd: () => {},
  onWaveStart: () => {},
  onWaveEnd: () => {},
};

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
