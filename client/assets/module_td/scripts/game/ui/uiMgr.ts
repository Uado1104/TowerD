import { Prefab } from 'cc';
import { ResourceManagerBase } from '../../core/resource/resourceSystem';
import { EUIPrefab, UIResDefine } from './uiDefine';
/**
 * 注册ui的controller以及对应的prefab位置，controller主要用于处理ui的逻辑，prefab主要用于ui的显示
 */
export class UIMgr extends ResourceManagerBase<typeof Prefab, EUIPrefab> {
  private static myInstance = null;

  static get inst() {
    if (UIMgr.myInstance == null) {
      UIMgr.myInstance = new UIMgr(UIResDefine, Prefab);
    }
    return UIMgr.myInstance;
  }

  private constructor(resDefine, resType) {
    super(resDefine, resType);
  }
}
