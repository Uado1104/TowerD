/**
 * 处理器
 */
export class Handler {
  method?: () => void;
  caller: any;
  once = true;
  private isOver = false;

  /**
   * 运行
   * @param args
   */
  Run(...args: any[]) {
    if (this.method && !this.isOver) {
      this.method.apply(this.caller, args);
      if (this.once) {
        this.isOver = true;
      }
    }
  }

  /**
   * 判断是否相同
   * @param value
   * @returns
   */
  Equal(value: Handler): boolean {
    if (this.method == value.method && this.caller == value.caller) {
      return true;
    }
    return false;
  }

  /**
   * 创建一个实例
   * @param caller
   * @param method
   * @param once
   * @returns
   */
  static Create(caller: any, method: () => void | undefined, once = false): Handler {
    const h = new Handler();
    h.caller = caller;
    h.method = method;
    h.once = once;
    h.isOver = false;
    return h;
  }
}
