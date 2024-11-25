import { UIController } from '../UIController';
import { UIMgr } from '../UIMgr';
import { Layout_UIWaiting } from './Layout_UIWaiting';

const loadingTxtArr = ['.', '..', '...'];

let _inst: UIWaiting = null;

export class UIWaiting extends UIController {
  private _contentStr = 'Loading';
  protected onCreated(): void {}

  public static show(contentStr?: string): UIWaiting {
    if (!_inst) {
      _inst = UIMgr.inst.showUI(UIWaiting);
    }
    _inst._contentStr = contentStr || 'Loading';
    return _inst;
  }

  public static hide(): void {
    if (_inst) {
      _inst.close();
      _inst = null;
    }
  }

  protected onUpdate() {
    const layout = this._layout as Layout_UIWaiting;
    if (layout.loadingIcon) {
      const euler = layout.loadingIcon.eulerAngles;
      const rot = (Date.now() / 1000) * 90;
      layout.loadingIcon.setRotationFromEuler(euler.x, euler.y, rot);
    }

    if (layout.loadingTxt) {
      const idx = Math.floor(Date.now() / 500) % 3;
      layout.loadingTxt.string = this._contentStr + loadingTxtArr[idx];
    }
  }

  onDispose() {
    _inst = null;
  }
}
