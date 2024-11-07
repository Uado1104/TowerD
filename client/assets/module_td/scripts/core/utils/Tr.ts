import { StringUtils } from './StringUtils';

export class Tr {
  /**
   * 当前语言
   */
  static lang = 'zh-Hans';

  /**
   * 语言数据
   */
  private static langPacks: any = {};

  /**
   * 初始化
   * @param langPacks
   */
  static init(langPacks: any): void {
    this.langPacks = langPacks;
  }

  /**
   * 转换文字语言
   */
  static Traslate(value: string, ...rest: any[]): string {
    let langeValue: string;
    if (this.langPacks) {
      langeValue = this.langPacks[value] || value;
    } else {
      langeValue = value;
    }
    if (rest == null || rest == undefined || rest.length == 0) {
      return langeValue;
    }
    return StringUtils.Substitute(langeValue, rest);
  }

  /**
   * 替换参数
   * substitute("你好{0},你吃{1}了吗?","蝈蝈","饭")
   * 返回 你好蝈蝈你吃饭了吗?
   * @param value
   * @param rest
   * @returns
   */
  static Substitute(value: string, ...rest: any[]): string {
    return StringUtils.Substitute(value, rest);
  }
}
