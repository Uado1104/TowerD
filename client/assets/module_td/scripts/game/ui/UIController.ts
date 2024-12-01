import { _decorator, Prefab, isValid, Button, find, EventHandler, Node, Component, EventTouch, Slider } from 'cc';
import { EventDispatcher } from '../../core/events/eventSystem';
import { uiEventsDefine } from './uiDefine';
/**
 * @en base class of UI Panel
 * @zh 各类UI面板基类
 * */
export class UIController {
  private static _idBase = 1000;

  private static _controllers: UIController[];

  static readonly event = new EventDispatcher<typeof uiEventsDefine>();

  /***
   * @en hide and destroy all ui panel.
   * @zh 隐藏并销毁所有UI面板
   *  */
  static closeAll() {
    UIController._controllers.forEach((c) => {
      if (!c._ingoreCloseAll) {
        c.close();
      }
    });
  }

  private _instId = 0;
  private _prefab: string | Prefab;
  private _layer: number;
  protected _layout: any;
  protected node: Node;
  protected _destroyed = false;
  protected _ingoreCloseAll = false;
  constructor(prefab: string | Prefab, layer: number, layoutCls: any) {
    this._prefab = prefab;
    this._layer = layer;
    this._layout = layoutCls;
    this._instId = UIController._idBase++;
    UIController._controllers.push(this);
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
    this._controllers.forEach((c) => {
      if (c.node && isValid(c.node)) {
        c.onUpdate(dt);
      }
    });
  }

  //setup this ui,called by UIMgr.
  setup(node: Node) {
    this.node = node;

    if (this._layout) {
      this._layout = this.node.getComponent(this._layout);
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
    const idx = UIController._controllers.indexOf(this);
    UIController._controllers.slice(idx, 1);
    if (this.node) {
      this.node.removeFromParent();
      this.onDispose();
      this.node.destroy();
      this.node = null;
    }
  }

  /**
   * @en add button event handler
   * @zh 添加按钮事件
   * @param relativeNodePath to indicate a button node, can pass `string`|`Node`|`Button` here.
   * @param cb will be called when event emits. method format:(btn:Button,args:any)=>void
   * @param target the `this` argument of `cb`
   *  */
  onButtonEvent(relativeNodePath: string | Node | Button, cb: () => void, target?: any, args?: any) {
    let buttonNode: Node = null;
    if (relativeNodePath instanceof Node) {
      buttonNode = relativeNodePath;
    } else if (relativeNodePath instanceof Button) {
      buttonNode = relativeNodePath.node;
    } else {
      buttonNode = find(relativeNodePath, this.node);
    }

    if (!buttonNode) {
      return null;
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
    handler['$args$'] = args;

    clickEvents.push(handler);
    btn.clickEvents = clickEvents;
  }

  /***
   * @en the extra resource needed by this ui panel.the ui will not be created until these res loaded.
   * @zh 本UI使用的依赖资源.UI会等这些资源加载完成后才创建。
   *  */
  public getRes(): [] {
    return [];
  }

  //子类的所有操作，需要在这个函数之后。
  protected onCreated(params?: any) {}
  //销毁
  protected onDispose() {}
  //
  protected onUpdate(dt: number) {}
}
