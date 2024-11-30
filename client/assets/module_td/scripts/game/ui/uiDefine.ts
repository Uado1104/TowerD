import { TResDefine } from '../../core/resource/define';

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
