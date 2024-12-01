import { Button } from 'cc';
import { ui_test } from '../../../ui/ui_test/ui_test';
import { ResourceConfig, TResDefine } from '../../core/resource/define';

export enum EUIPrefab {
  test = 'test',
}

export const UIResDefine: TResDefine<EUIPrefab> = {
  test: {
    bundleName: 'module_td',
    path: 'prefabs/test',
    cache: true,
  },
};

export function getUIResDefine(type: EUIPrefab): ResourceConfig {
  return UIResDefine[type];
}

export interface UIClsDefine {
  layer: number;
  layerCls: any;
}

export const UIClsDefine: Record<EUIPrefab, UIClsDefine> = {
  test: {
    layer: 1,
    layerCls: Button,
  },
};

export function getUIClsDefine(type: EUIPrefab): UIClsDefine {
  return UIClsDefine[type];
}

export const uiEventsDefine = {
  onEnenmyNumberChanged: () => {},
};
