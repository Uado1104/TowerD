import { ECSSystem } from './ECSSystem';

export abstract class ECSComponent {
  /**所属entity*/
  entity: number | string;

  /**脏数据标记回调*/
  dirtySignal: (() => void) | null = null;

  constructor() {}

  /**获取组件依赖的系统列表*/
  GetDependencies(): Array<new () => ECSSystem> {
    return null;
  }

  /**标记该组件数据为脏*/
  MarkDirtied(): void {
    if (this.dirtySignal) this.dirtySignal();
  }

  /**重置*/
  Reset(): void {
    this.entity = -1;
    this.dirtySignal = null;
  }
  abstract Destroy(): void;
}
