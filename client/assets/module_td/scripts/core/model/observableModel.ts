import { EventDispatcher } from '../events/eventSystem';

type Observer = (newValue: any, oldValue: any, path: string) => void;

const eventDefine = {
  onDataChanged: ((newValue: any, oldValue: any, path: string) => {}) as Observer,
};

function combinePath(basePath: string, key: string): string {
  return basePath ? `${basePath}.${key}` : key;
}

export class ObservableModel<T extends object> {
  private observers: Map<string, Set<Observer>> = new Map();

  private event = new EventDispatcher<typeof eventDefine>();

  constructor(private model: T) {}

  // 注册观察者
  addObserver(path: string, observer: Observer): void {
    let keyObservers = this.observers.get(path);
    if (!keyObservers) {
      keyObservers = new Set();
      this.observers.set(path, keyObservers);
    }
    keyObservers.add(observer);
    this.event.on('onDataChanged', observer);
  }

  // 移除观察者（可选）
  removeObserver(path: string, observer: Observer): void {
    const keyObservers = this.observers.get(path);
    if (!keyObservers || !keyObservers.has(observer)) {
      return;
    }
    this.event.remove('onDataChanged', observer);
    keyObservers.delete(observer);
  }

  // 代理模型
  get proxy(): T {
    return this.createProxy(this.model, '');
  }

  // 创建代理
  private createProxy(obj: T, basePath: string): T {
    return new Proxy(obj, {
      get: (target, key) => {
        const value = target[key];
        // 如果是对象，递归创建代理
        if (value && typeof value === 'object') {
          return this.createProxy(value, combinePath(basePath, key as string));
        }
        return value;
      },
      set: (target, key, value) => {
        const path = combinePath(basePath, key as string);
        const oldValue = target[key];
        target[key] = value;

        // 通知观察者
        const keyObservers = this.observers.get(path);
        if (keyObservers) {
          this.event.emit('onDataChanged', value, oldValue, path);
        }

        // 如果新值是对象，递归代理
        if (value && typeof value === 'object') {
          target[key] = this.createProxy(value, path);
        }

        return true;
      },
    });
  }
}
