import { ECSEntity } from './ECSEntity';
import { MatcherAllOf } from './matchers/MatcherAllOf';
import { MatcherAnyOf } from './matchers/MatcherAnyOf';
import { MatcherNoneOf } from './matchers/MatcherNoneOf';

export class ECSMatcher {
  get isEmpty(): boolean {
    return this.myEntitys.size == 0;
  }

  clear(): void {
    this.myEntitys.clear();
  }

  get elements(): Array<number | string> {
    return Array.from(this.myEntitys.keys());
  }
  /**
   * 全部包含或任意包含
   */
  matcher: MatcherAllOf | MatcherAnyOf | undefined = undefined;

  /**
   * 不能包含的
   */
  matcherNoneOf: MatcherNoneOf | undefined = undefined;

  /**
   * 编组所匹配的元素(内部接口)
   */
  private myEntitys: Map<ECSEntity, ECSEntity> = new Map<ECSEntity, ECSEntity>();

  deleteEntity(entity: ECSEntity): void {
    if (!this.myEntitys.has(entity)) return;
    this.myEntitys.delete(entity);
  }

  addEntity(entity: ECSEntity): void {
    if (this.myEntitys.has(entity)) return;
    this.myEntitys.set(entity, entity);
  }

  constructor(allOrAny: MatcherAllOf | MatcherAnyOf, none?: MatcherNoneOf) {
    this.matcher = allOrAny;
    this.matcherNoneOf = none;
  }

  Destroy(): void {
    this.matcher = undefined;
    this.matcherNoneOf = undefined;
    this.myEntitys.clear();
  }
}
