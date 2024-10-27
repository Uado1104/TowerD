/**
 * bit位操作
 */
export class BitFlag {
  private __flags = 0;

  private __elements: Array<number>;

  constructor() {
    this.__elements = [];
  }

  Add(flag: number): void {
    this.__flags |= flag;
    if (this.__elements.indexOf(flag) < 0) {
      this.__elements.push(flag);
    }
  }

  Remove(flag: number): void {
    this.__flags ^= flag;
    const index: number = this.__elements.indexOf(flag);
    if (index >= 0) {
      this.__elements.splice(index, 1);
    }
  }

  /**
   * 是否包含
   * @param flag
   * @returns
   */
  Has(flag: number): boolean {
    return (this.__flags & flag) == flag;
  }

  /**
   * 位码
   */
  get flags(): number {
    return this.__flags;
  }

  get elements(): Array<number> {
    return this.__elements;
  }

  Destroy(): void {
    this.__flags = 0;
    this.__elements.length = 0;
    this.__elements = null;
  }
}
