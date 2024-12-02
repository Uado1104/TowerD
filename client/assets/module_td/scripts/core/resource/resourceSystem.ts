import { Asset, AssetManager, assetManager, Prefab } from 'cc';
import { TResDefine } from './define';
import { Logger } from '../debugers/log';

export class ResourceManager<AssetT extends Asset, T extends string> {
  private static readonly bundles: Map<string, AssetManager.Bundle> = new Map(); // 已加载的资源包
  private static readonly cache: Map<string, Asset> = new Map(); // 已缓存的资源

  static genCacheKey(bundleName: string, path: string): string {
    return `${bundleName}/${path}`;
  }

  constructor(
    private readonly resDefine: TResDefine<T>,
    private readonly resType: typeof Asset,
  ) {}

  /**
   * 加载资源包
   * @param bundleName 资源包名称
   */
  static async loadBundle(bundleName: string): Promise<AssetManager.Bundle> {
    if (ResourceManager.bundles.has(bundleName)) {
      return ResourceManager.bundles.get(bundleName)!;
    }
    return new Promise((resolve, reject) => {
      assetManager.loadBundle(bundleName, (err, bundle) => {
        if (err) {
          Logger.error('ResManager', `Failed to load bundle: ${bundleName} ${err}`);
          reject(err);
        } else {
          ResourceManager.bundles.set(bundleName, bundle);
          Logger.log('ResManager', `Bundle loaded: ${bundleName}`);
          resolve(bundle);
        }
      });
    });
  }

  /**
   * 释放整个资源包
   * @param bundleName 资源包名称
   */
  static releaseBundle(bundleName: string): void {
    if (!ResourceManager.bundles.has(bundleName)) {
      return;
    }
    const bundle = ResourceManager.bundles.get(bundleName)!;
    bundle.releaseAll();
    ResourceManager.bundles.delete(bundleName);
    Logger.log('ResManager', `Bundle released: ${bundleName}`);
  }

  /**
   * 释放资源
   * @param resourceEnum 资源枚举
   */
  public release(resourceEnum: T): void {
    const config = this.resDefine[resourceEnum];
    if (!config) {
      Logger.error('ResManager', `Resource configuration not found for: ${resourceEnum}`);
      return;
    }

    const cacheKey = ResourceManager.genCacheKey(config.bundleName, config.path);
    if (!ResourceManager.cache.has(cacheKey)) {
      return;
    }
    const asset = ResourceManager.cache.get(cacheKey);
    assetManager.releaseAsset(asset!);
    ResourceManager.cache.delete(cacheKey);
    Logger.log('ResManager', `Resource released: ${cacheKey}`);
  }

  /**
   * 加载资源
   * @param resourceEnum 资源枚举
   */
  async load(resourceEnum: T): Promise<Asset> {
    const config = this.resDefine[resourceEnum];
    if (!config) {
      Logger.error('ResManager', `Resource configuration not found for: ${resourceEnum}`);
      return;
    }

    const cacheKey = ResourceManager.genCacheKey(config.bundleName, config.path);

    // 如果需要缓存并已存在缓存，则直接返回
    if (config.cache && ResourceManager.cache.has(cacheKey)) {
      return ResourceManager.cache.get(cacheKey) as unknown as AssetT;
    }

    // 加载资源包
    const bundle = await ResourceManager.loadBundle(config.bundleName);

    // 加载资源
    return new Promise((resolve, reject) => {
      bundle.load([config.path], this.resType, (err, assets) => {
        if (err) {
          Logger.error('ResManager', `Failed to load resource: ${cacheKey} ${err}`);
          reject(err);
        } else {
          Logger.log('ResManager', `Resource loaded: ${cacheKey}`);
          // 如果需要缓存，则存储到缓存
          if (config.cache) {
            ResourceManager.cache.set(cacheKey, assets[0]);
          }
          resolve(assets[0] as AssetT);
        }
      });
    });
  }
}
