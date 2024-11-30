// 定义资源配置接口
export interface ResourceConfig {
  bundleName: string; // 资源所在的包名
  path: string; // 资源路径
  cache: boolean; // 是否缓存资源
}

export type TResDefine<T extends string> = Record<T, ResourceConfig>;
