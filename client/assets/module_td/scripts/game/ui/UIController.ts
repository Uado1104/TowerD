import { Prefab, isValid, Node, Component } from 'cc';
import { EventDispatcher } from '../../core/events/eventSystem';
import { uiEventsDefine } from './uiDefine';

/**
 * @en base class of UI Panel
 * @zh 各类UI面板基类
 * */
export class UIController {
  private static _idBase = 1000;

  private static myControllerMap: Map<typeof UIController, UIController> = new Map();

  static getController<T extends UIController>(cls: typeof UIController): T {
    return UIController.myControllerMap.get(cls) as T;
  }

  static getControllerById<T extends UIController>(instId: number): T {
    return Array.from(UIController.myControllerMap.values()).find((c) => c.instId === instId) as T;
  }

  static readonly event = new EventDispatcher<typeof uiEventsDefine>();

  /***
   * @en hide and destroy all ui panel.
   * @zh 隐藏并销毁所有UI面板
   *  */
  static closeAll() {
    UIController.myControllerMap.forEach((c) => {
      if (!c._ingoreCloseAll) {
        c.close();
      }
    });
  }

  private _instId = 0;
  private _prefab: string | Prefab;
  private _layer: number;
  private _layoutCls: typeof Component;
  protected _layout: Component;
  protected node: Node;
  protected _destroyed = false;
  protected _ingoreCloseAll = false;
  constructor(prefab: string | Prefab, layer: number, layoutCls: typeof Component, myCls: typeof UIController) {
    this._prefab = prefab;
    this._layer = layer;
    this._layoutCls = layoutCls;
    this._instId = UIController._idBase++;
    UIController.myControllerMap.set(myCls, this);
  }

  /***
   * @en the instance id to indicate an unique ui panel.
   * @zh 实例ID，用于标记一个唯一面板实例
   *  */
  get instId(): number {
    return this._instId;
  }

  /***
   * @en url of the prefab used by this ui panel.
   * @zh 本UI使用prefab路径
   *  */
  get prefab(): string | Prefab {
    return this._prefab;
  }

  /***
   * @en layer of this ui panel.
   * @zh 本UI所在的UI层级
   *  */
  get layer(): number {
    return this._layer;
  }

  /***
   * @en layout of this ui panel.
   * @zh 本UI所在的UI层级
   *  */
  getLayout(): any {
    return this._layout;
  }

  //update all ui, called by UIMgr.
  static updateAll(dt: number) {
    this.myControllerMap.forEach((c) => {
      if (c.node && isValid(c.node)) {
        c.onUpdate(dt);
      }
    });
  }

  //setup this ui,called by UIMgr.
  setup(node: Node) {
    this.node = node;

    if (this._layout) {
      this._layout = this.node.getComponent(this._layoutCls);
    }

    //notify sub class to handle something.
    //节点创建完毕，调用子类的处理函数。
    this.onCreated();

    if (this._destroyed) {
      this.close();
    }
  }

  /**
   * @en hide and destroy this ui panel.
   * @zh 隐藏并销毁此UI面板
   *  */
  close() {
    this._destroyed = true;
    const idx = UIController.getControllerById(this._instId);
    if (!idx) {
      return;
    }
    UIController.myControllerMap.delete(idx.constructor as typeof UIController);
    if (!this.node) {
      return;
    }
    this.node.removeFromParent();
    this.onDispose();
    this.node.destroy();
    this.node = null;
  }

  /***
   * @en the extra resource needed by this ui panel.the ui will not be created until these res loaded.
   * @zh 本UI使用的依赖资源.UI会等这些资源加载完成后才创建。
   *  */
  public getRes(): [] {
    return [];
  }

  /***
   * @zh 节点创建时调用
   *  */
  protected onCreated() {}

  /** 销毁 */
  protected onDispose() {}

  /** 更新 */
  protected onUpdate(dt: number) {}
}
