/**
 * 稀疏集合
 */
export class SparseSet {
  /**无效值 */
  invalid = 0;
  private __maxCount = 0;
  private __packed: Uint32Array;
  private __index = 0;
  private __sparse: Uint32Array;

  constructor(maxCount = 2048) {
    this.__maxCount = this.invalid = maxCount;
    this.__packed = new Uint32Array(this.__maxCount);
    this.__packed.fill(this.invalid);
    this.__sparse = new Uint32Array(this.__maxCount);
    this.__sparse.fill(this.invalid);
  }

  /**
   * 添加
   * @param id
   */
  Add(id: number): void {
    if (id >= this.invalid) {
      throw new Error('超出最大索引:' + id + '/' + this.invalid);
    }
    this.__packed[this.__index] = id;
    this.__sparse[id] = this.__index;
    this.__index++;
  }

  /**
   * 是否包含
   * @param id
   * @returns
   */
  Contains(id: number): boolean {
    if (this.__sparse[id] == this.invalid) {
      return false;
    }
    return true;
  }

  /**
   * 删除
   * @param id
   */
  Remove(id: number): void {
    if (this.length == 1) {
      this.__packed[0] = this.invalid;
      this.__sparse[id] = this.invalid;
    } else {
      const delete_packIdx = this.__sparse[id];
      const swap_id = this.__packed[this.__index - 1];
      this.__packed[delete_packIdx] = swap_id;
      this.__sparse[id] = this.invalid;
      this.__sparse[swap_id] = delete_packIdx;
      this.__index--;
    }
  }

  /**
   * 清除所有
   */
  Clear(): void {
    this.__packed.fill(this.invalid);
    this.__sparse.fill(this.invalid);
    this.__index = 0;
  }

  Destroy(): void {
    this.__packed = null;
    this.__sparse = null;
  }

  /**
   * 获取packed的索引值
   * @param id
   * @returns
   */
  GetPackedIdx(id: number): number {
    const pidx = this.__sparse[id];
    if (pidx != this.invalid) {
      return this.__sparse[id];
    }
    return this.invalid;
  }

  get packed(): Uint32Array {
    return this.__packed;
  }

  get length(): number {
    return this.__index;
  }

  get maxCount(): number {
    return this.__maxCount;
  }
}
