import { ECSMatcher } from './ECSMatcher';
import { ECSWorld } from './ECSWorld';
import { MatcherAllOf } from './matchers/MatcherAllOf';
import { MatcherAnyOf } from './matchers/MatcherAnyOf';
import { MatcherNoneOf } from './matchers/MatcherNoneOf';

export abstract class ECSSystem {
  /**优先级 */
  priority = 0;

  /**是否使用脏数据*/
  useDirty = false;

  /**匹配器 */
  private myMatcher: ECSMatcher;

  get matcher(): ECSMatcher {
    return this.myMatcher;
  }

  /**所属世界 */
  private __world: ECSWorld | null = null;
  /**
   * 系统
   * @param allOrAny  匹配所有或任意一个
   * @param none      不能包含
   * @param useDirty  是否使用脏数据机制
   */
  constructor(allOrAny: MatcherAllOf | MatcherAnyOf, none?: MatcherNoneOf, useDirty = false) {
    this.myMatcher = new ECSMatcher(allOrAny, none);
    this.useDirty = useDirty;
  }

  /**设置所属世界 */
  SetWorld(v: ECSWorld): void {
    this.__world = v;
  }

  /**心跳 */
  Tick(dt: number): void {
    if (this.myMatcher.isEmpty) return;
    this.$tick(dt);
    if (this.useDirty) {
      this.myMatcher.clear();
    }
  }

  /**匹配结果 */
  get entitys(): Array<number | string> {
    return this.myMatcher.elements;
  }

  /**所属世界 */
  get world(): ECSWorld {
    return this.__world!;
  }

  protected $tick(dt: number): void {}

  /**销毁 */
  Destory(): void {
    this.__world = null;
    this.myMatcher = null;
  }
}
