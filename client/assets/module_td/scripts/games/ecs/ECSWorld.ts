import { ECSComponent } from './ECSComponent';
import { ECSMatcher } from './ECSMatcher';
import { ECSSystem } from './ECSSystem';
import { ECSStorage } from './ECSStorage';
import { Matcher } from './matchers/Matcher';
import { MatcherAllOf } from './matchers/MatcherAllOf';
import { MatcherAnyOf } from './matchers/MatcherAnyOf';
import { ECSEntity } from './ECSEntity';

export class ECSWorld {
  private __maxCount: number;

  private __storage: ECSStorage<ECSComponent>;

  private __systems: Map<new () => ECSSystem, ECSSystem>;

  /**等待删除的entity*/
  private __waitFree: Array<ECSEntity> = [];

  /**
   * 初始化
   * @param maxCount
   * @param sparsePage
   */
  constructor(maxCount: number) {
    this.__maxCount = maxCount;
    this.__storage = new ECSStorage<ECSComponent>(this.__maxCount);
    this.__systems = new Map<new () => ECSSystem, ECSSystem>();
  }

  private get systemElements(): ECSSystem[] {
    return Array.from(this.__systems.values());
  }

  /**
   * 心跳
   * @param dt
   */
  Tick(dt: number): void {
    //系统
    const systems = this.systemElements;
    for (let index = 0; index < systems.length; index++) {
      const sys = systems[index];
      sys.Tick(dt);
    }
    if (this.__waitFree.length == 0) return;
    //删除
    for (let index = 0; index < this.__waitFree.length; index++) {
      const id = this.__waitFree[index];
      this.__storage.Remove(id);
      //从所有系统匹配纪律中删除
      for (let index = 0; index < systems.length; index++) {
        const sys = systems[index];
        sys.matcher.deleteEntity(id);
      }
    }
    this.__waitFree.length = 0;
  }

  /**
   * 创建
   */
  Create(id: ECSEntity): void {
    this.__storage.Add(id);
  }

  /**
   * 查询是否包含
   * @param id
   * @returns
   */
  Has(id: ECSEntity): boolean {
    return this.__storage.Has(id);
  }

  /**
   * 删除
   * @param id
   * @returns
   */
  Remove(id: ECSEntity): void {
    const index = this.__waitFree.indexOf(id);
    if (index >= 0) {
      return;
    }
    this.__waitFree.push(id);
  }

  /**
   * 添加组件
   * @param id
   * @param type
   * @returns
   */
  AddComponent<T extends ECSComponent>(id: ECSEntity, type: new () => T): T {
    const result = this.__storage.AddValue(id, type);
    result.dirtySignal = () => {
      this.__componentDirty(result);
    };
    //检测组件依赖的系统，如果没有则添加
    const dependencies = result.GetDependencies();
    if (dependencies && dependencies.length > 0) {
      for (let index = 0; index < dependencies.length; index++) {
        const sysClass = dependencies[index];
        if (!this.HasSystem(sysClass)) {
          this.AddSystem(sysClass);
        }
      }
    }
    //记录所属
    result.entity = id;
    //匹配
    this.__matcher(id, false, true);
    return result as T;
  }

  /**
   * 查询entity是否包含组件
   * @param id
   * @param type
   * @returns
   */
  HasComponent<T extends ECSComponent>(id: ECSEntity, type: new () => T): boolean {
    return this.__storage.HasValue(id, type);
  }

  /**
   * 删除组件
   * @param id
   * @param type
   * @returns
   */
  RemoveComponent<T extends ECSComponent>(id: ECSEntity, type: new () => T): T {
    const result = this.__storage.RemoveValue(id, type);
    this.__matcher(result.entity, false, true);
    return result as T;
  }

  /**
   * 通过组件实例进行删除
   * @param id
   * @param com
   * @returns
   */
  RemoveComponentBy<T extends ECSComponent>(id: ECSEntity, com: ECSComponent): T {
    const result = this.__storage.RemoveValue(id, com['constructor'] as new () => T);
    this.__matcher(result.entity, false, true);
    return result as T;
  }

  /**
   * 获取组件
   * @param id
   * @param type
   * @returns
   */
  GetComponent<T extends ECSComponent>(id: ECSEntity, type: new () => T): T | null {
    return this.__storage.GetValue(id, type) as T;
  }

  /**
   * 添加系统
   */
  AddSystem(sysClass: new () => ECSSystem): void {
    if (this.__systems.has(sysClass)) {
      throw new Error('重复添加系统');
    }
    const sys = new sysClass();
    sys.SetWorld(this);
    this.__systems.set(sysClass, sys);
    //根据系统优先级排序
    this.systemElements.sort((a, b) => a.priority - b.priority);
    //按照编组规则匹配
    this.__matcherAll(sys);
  }

  /**
   * 是否包含该系统
   * @param key
   * @returns
   */
  HasSystem(key: new () => ECSSystem): boolean {
    return this.__systems.has(key);
  }

  /**
   * 获取系统
   * @param key
   * @returns
   */
  GetSystem(key: new () => ECSSystem): ECSSystem | undefined {
    return this.__systems.get(key);
  }

  /**
   * 删除系统
   * @param value
   */
  RemoveSystem(value: ECSSystem): void {
    const sysClass = value.constructor as new () => ECSSystem;
    if (!this.__systems.has(sysClass)) {
      throw new Error('找不到要删除的系统');
    }
    this.__systems.delete(sysClass);
    value.SetWorld(null);
    value.Destory();
    //根据系统优先级排序
    this.systemElements.sort((a, b) => a.priority - b.priority);
  }

  /**
   * 清理所有元素
   */
  ClearAll(): void {
    this.__storage.Clear();
    const systems = this.systemElements;
    for (let index = 0; index < systems.length; index++) {
      const sys = systems[index];
      sys.Destory();
    }
    this.__systems.clear();
  }

  Destroy(): void {
    this.ClearAll();
    this.__waitFree.length = 0;
    this.__waitFree = null;
    this.__storage.Destroy();
    this.__storage = null;
    this.__systems = null;
  }

  /**标记组件脏了 */
  private __componentDirty(component: ECSComponent): void {
    this.__matcher(component.entity, true);
  }

  /**将所有entity跟系统进行匹配 */
  private __matcherAll(sys: ECSSystem): void {
    const list = this.__storage.ids;
    for (let index = 0; index < list.length; index++) {
      const id = list[index];
      if (id == this.__storage.invalid) {
        break;
      }
      this.__matcherEntity(sys.matcher, id);
    }
  }

  private __matcher(id: ECSEntity, useDirty: boolean, all = false): void {
    const systems = this.systemElements;
    for (let index = 0; index < systems.length; index++) {
      const sys = systems[index];
      if (sys.useDirty == useDirty || all) {
        if (this.__matcherEntity(sys.matcher, id)) {
          sys.matcher.addEntity(id);
        } else {
          sys.matcher.deleteEntity(id);
        }
      }
    }
  }

  private __matcherEntity(matcher: ECSMatcher, id: ECSEntity): boolean {
    const mainMatcher: boolean = this.__matcherComponents(matcher.matcher!, id);
    const noneMatcher = matcher.matcherNoneOf == undefined ? true : this.__matcherComponents(matcher.matcherNoneOf, id);
    return mainMatcher && noneMatcher;
  }

  private __matcherComponents(matcher: Matcher, id: ECSEntity): boolean {
    if (matcher instanceof MatcherAllOf) {
      for (let index = 0; index < matcher.types.length; index++) {
        const comType = matcher.types[index];
        if (!this.__storage.HasValue(id, comType)) {
          return false;
        }
      }
      return true;
    } else if (matcher instanceof MatcherAnyOf) {
      for (let index = 0; index < matcher.types.length; index++) {
        const comType = matcher.types[index];
        if (this.__storage.HasValue(id, comType)) {
          return true;
        }
      }
      return false;
    }
    //排除
    for (let index = 0; index < matcher.types.length; index++) {
      const comType = matcher.types[index];
      if (this.__storage.HasValue(id, comType)) {
        return false;
      }
    }
    return true;
  }
}
