/**
 * 对象池
 */
export class Pool<T> {
  private __using: Array<T>;
  private __pool: Array<T>;
  private __class: new () => T;
  private __maxCount: number | undefined;
  private __countIndex = 0;

  constructor(type: new () => T, maxCount?: number) {
    this.__class = type;
    this.__using = [];
    this.__pool = [];
    this.__maxCount = maxCount;
  }

  Alloc(): T {
    let result: T;
    if (this.__pool.length > 0) {
      result = this.__pool.pop() as T;
      this.__using.push(result);
    } else {
      result = new this.__class();
      this.__using.push(result);
      if (this.__maxCount != undefined) {
        this.__countIndex++;
        if (this.__countIndex > this.__maxCount) {
          throw new Error('池内数量超出规定范围:' + this.__maxCount);
        }
      }
    }
    return result;
  }

  RecycleAll(): void {
    while (this.__using.length > 0) {
      this.Recycle(this.__using[0]);
    }
    this.__using.length = 0;
  }

  Recycle(v: T): void {
    const index = this.__using.indexOf(v);
    if (index < 0) {
      throw new Error('组件不属于该对象池!');
    }
    this.__using.splice(index, 1);
    const obj = <any>v;
    if (obj['Reset']) {
      obj.Reset();
    }
    this.__pool.push(v);
  }

  Destroy(): void {
    for (let index = 0; index < this.__using.length; index++) {
      const element = <any>this.__using[index];
      if (element['Reset']) {
        element.Reset();
      }
      if (element['Destroy']) {
        element.Destroy();
      }
    }
    for (let index = 0; index < this.__pool.length; index++) {
      const element = <any>this.__pool[index];
      if (element['Destroy']) {
        element.Destroy();
      }
    }
    this.__using.length = 0;
    this.__using = null;
    this.__pool.length = 0;
    this.__pool = null;
  }
}
