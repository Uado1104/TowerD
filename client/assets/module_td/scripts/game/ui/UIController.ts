import { Prefab, isValid, Node, Component, _decorator, EventTouch, Button, EventHandler } from 'cc';
import { EventDispatcher } from '../../core/events/eventSystem';
import { uiEventsDefine } from './uiDefine';
const { ccclass, property } = _decorator;

/***
 * @en internal class, used for handling node event.
 * @zh 内部类，用于节点事件监听
 *
 *  */
@ccclass('tgxNodeEventAgent')
export class __NodeEventAgent__ extends Component {
  /***
   * @en recieve button click event and deliver them to the real handlers.
   * @zh 接受按钮事件，并转发给真正的处理函数
   * */
  onButtonClicked(evt: EventTouch, customEventData) {
    const btn = (evt.target as Node).getComponent(Button);
    const clickEvents = btn.clickEvents;
    for (let i = 0; i < clickEvents.length; ++i) {
      const h = clickEvents[i];
      if (h.customEventData == customEventData) {
        const cb = h['$cb$'];
        const target = h['$target$'];
        const args = h['$args$'];
        cb.apply(target, [btn, args]);
      }
    }
  }
}
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

    if (!this._layout) {
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
  getRes(): [] {
    return [];
  }

  onButtonEvent(relativeNodePath: string | Node | Button, cb: () => void, target?: UIController) {
    let buttonNode: Node = null;
    if (relativeNodePath instanceof Node) {
      buttonNode = relativeNodePath;
    } else if (relativeNodePath instanceof Button) {
      buttonNode = relativeNodePath.node;
    }

    if (!buttonNode) {
      return null;
    }

    //添加转发器
    let agent = this.node.getComponent(__NodeEventAgent__);
    if (!agent) {
      agent = this.node.addComponent(__NodeEventAgent__);
    }

    const btn = buttonNode.getComponent(Button);
    const clickEvents = btn.clickEvents;
    const handler = new EventHandler();
    handler.target = this.node;
    handler.component = 'tgxNodeEventAgent';
    handler.handler = 'onButtonClicked';
    handler.customEventData = '' + UIController._idBase++;

    //附加额外信息 供事件转发使用
    handler['$cb$'] = cb;
    handler['$target$'] = target;

    clickEvents.push(handler);
    btn.clickEvents = clickEvents;
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
