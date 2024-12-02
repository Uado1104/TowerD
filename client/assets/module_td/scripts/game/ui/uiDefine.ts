import { Button, Component } from 'cc';
import { ResourceConfig } from '../../core/resource/define';
import { UIController } from './UIController';
import { UiTestController } from './uiTestController';

export interface UIResourceConfig extends ResourceConfig {
  controllerCls: typeof UIController;
  layerCls: typeof Component;
  layer: number;
}

export enum EUIPrefab {
  test = 'test',
}

export const UIResDefine: Record<EUIPrefab, UIResourceConfig> = {
  test: {
    bundleName: 'module_td',
    path: 'prefabs/test',
    cache: true,
    layer: 1,
    controllerCls: UiTestController,
    layerCls: Button,
  },
};

export function getUIResDefine(type: EUIPrefab): UIResourceConfig {
  return UIResDefine[type];
}

export const uiEventsDefine = {
  onEnenmyNumberChanged: () => {},
};
