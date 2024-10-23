import { ModuleDef } from "../../scripts/ModuleDef";
import { SceneDef } from "../../scripts/SceneDef";

export class IGameSceneInfo {
    id: string;
    name: string;
    scene:  tgx.ISceneInfo;
}


let subGameConf: IGameSceneInfo[] = [
    {
        id: 'lobby',
        name: '大厅',
        scene: SceneDef.LOBBY,
    },
    {
        id: 'normal',
        name: '普通游戏模式',
        scene: SceneDef.GAME,
    },
];

export function getSubGameConf(subgameId: string) {
    for (let i = 0; i < subGameConf.length; ++i) {
        let conf = subGameConf[i];
        if (conf.id == subgameId) {
            return conf;
        }
    }
}