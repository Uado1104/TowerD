import { Pool } from '../utils/Pool';
import { ECSEntity } from './ECSEntity';
import { SparseSet } from './SparseSet';

/**
 * 存储器
 */
export class ECSStorage<T> {
  private __uidMapping: Map<ECSEntity, number>;
  private __valuePool: Map<new () => T, Pool<T>>;
  private __values: Map<new () => T, Array<T | null>>;
  private __sparseSet: SparseSet;
  private __freeEntitys: Array<number>;
  private __entityIndex = 0;

  constructor(maxCount: number) {
    this.__uidMapping = new Map<number, number>();
    this.__sparseSet = new SparseSet(maxCount);
    this.__valuePool = new Map<new () => T, Pool<T>>();
    this.__values = new Map<new () => T, Array<T | null>>();
    this.__freeEntitys = [];
  }

  /**
   * 添加
   * @param id
   */
  Add(id: ECSEntity): void {
    if (this.__uidMapping.has(id)) {
      throw new Error('重复添加:' + id);
    }
    let entity: number;
    if (this.__freeEntitys.length > 0) {
      entity = this.__freeEntitys.pop();
    } else {
      entity = this.__entityIndex;
      this.__entityIndex++;
    }
    this.__uidMapping.set(id, entity);
    this.__sparseSet.Add(entity);
  }

  /**
   * 是否包含
   * @param id
   * @returns
   */
  Has(id: ECSEntity): boolean {
    return this.__uidMapping.has(id);
  }

  /**
   * 删除
   * @param id
   * @returns
   */
  Remove(id: ECSEntity): void {
    const entity = this.__uidMapping.get(id);
    const deleteIdx = this.__sparseSet.GetPackedIdx(entity);
    const lastIdx = this.__sparseSet.length - 1;
    //删除关联值
    const types = this.__values.keys();
    for (const type of types) {
      this.RemoveValue(id, type);
    }
    if (lastIdx >= 0) {
      for (const [type, _] of this.__values) {
        const list = this.__values.get(type);
        if (list == null) continue;
        list[deleteIdx] = list[lastIdx];
        list[lastIdx] = null;
      }
    }
    this.__uidMapping.delete(id);
    this.__sparseSet.Remove(entity);
    this.__freeEntitys.push(entity);
  }

  /**
   * 获取
   * @param id
   * @param type
   * @returns
   */
  GetValue(id: ECSEntity, type: new () => T): T | null {
    const entity = this.__uidMapping.get(id);
    const pIdx = this.__sparseSet.GetPackedIdx(entity);
    if (pIdx == this.__sparseSet.invalid) {
      return null;
    }
    const list = this.__values.get(type);
    if (list == null || list.length == 0 || pIdx >= list.length) {
      return null;
    }
    return list[pIdx] as T;
  }

  /**
   * 添加
   * @param id
   * @param type
   * @returns
   */
  AddValue(id: ECSEntity, type: new () => T): T {
    const entity = this.__uidMapping.get(id);
    if (!this.__sparseSet.Contains(entity)) throw new Error('不存在:' + id);
    const pIdx = this.__sparseSet.GetPackedIdx(entity);
    let list = this.__values.get(type);
    if (list == null) {
      list = new Array<T>(this.__sparseSet.maxCount);
      this.__values.set(type, list);
    }
    if (list[pIdx] != null) {
      throw new Error(id + '=>重复添加:' + type);
    }
    //对象池
    let pool = this.__valuePool.get(type);
    if (!pool) {
      pool = new Pool(type);
      this.__valuePool.set(type, pool);
    }
    list[pIdx] = pool.Alloc();
    return list[pIdx] as T;
  }

  /**
   * 是否包含Value
   * @param id
   * @param type
   */
  HasValue(id: ECSEntity, type: new () => T): boolean {
    const entity = this.__uidMapping.get(id);
    if (!this.__sparseSet.Contains(entity)) {
      throw new Error('entity不存在:' + id);
    }
    const pIdx = this.__sparseSet.GetPackedIdx(entity);
    const list = this.__values.get(type);
    if (list == null) {
      return false;
    }
    if (list[pIdx] == null) {
      return false;
    }
    return true;
  }

  /**
   * 删除
   * @param id
   * @param type
   * @returns
   */
  RemoveValue(id: ECSEntity, type: new () => T): T {
    const entity = this.__uidMapping.get(id);
    if (!this.__sparseSet.Contains(entity)) {
      throw new Error('entity不存在:' + id);
    }
    const pIdx = this.__sparseSet.GetPackedIdx(entity);
    const list = this.__values.get(type);
    if (list == null || list.length == 0) {
      throw new Error(id + '=>上找不到要删除的组件:' + type);
    }
    const result = list[pIdx] as T;
    list[pIdx] = null;
    const pool = this.__valuePool.get(type);
    if (!pool) {
      throw new Error('对象池不存在！');
    }
    pool.Recycle(result);
    return result;
  }

  /**
   * 清理
   */
  Clear(): void {
    this.__freeEntitys.length = 0;
    this.__entityIndex = 0;
    const ids = this.ids;
    while (ids.length > 0) {
      this.Remove(ids[0]);
    }
  }

  /**销毁 */
  Destroy(): void {
    this.__uidMapping.clear();
    this.__uidMapping = null;
    this.__sparseSet.Destroy();
    this.__sparseSet = null;
    this.__valuePool.clear();
    this.__valuePool = null;
    this.__values.clear();
    this.__values = null;
  }

  /**无效值 */
  get invalid(): number {
    return this.__sparseSet.invalid;
  }

  get ids(): Array<ECSEntity> {
    return Array.from(this.__uidMapping.keys());
  }
}
