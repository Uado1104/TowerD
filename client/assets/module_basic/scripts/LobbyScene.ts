import { _decorator, assetManager, Component, Label, sys } from 'cc';
import { SceneDef } from '../../scripts/SceneDef';
import { UserMgr } from './UserMgr';
import { GameSceneUtil } from './GameSceneUtil';
import { UIAnnouncement } from '../ui_announcement/UIAnnouncement';
import { UITeam } from '../ui_team/UITeam';
import { lobbyNet } from './NetGameServer';
import { UIChat } from '../ui_chat/UIChat';
import { LobbyMgr } from './LobbyMgr';
import { UIGameMatching } from '../ui_game_matching/UIGameMatching';
const { ccclass, property } = _decorator;

@ccclass('LobbyScene')
export class LobbyScene extends Component {
  @property(Label) lblName: Label = null;
  async start() {
    if (!UserMgr.inst.uid) {
      tgx.SceneUtil.loadScene(SceneDef.START);
      return;
    }

    GameSceneUtil.inst.exitGame();

    tgx.UIMgr.inst.closeAll();

    tgx.UIMgr.inst.showUI(UIAnnouncement);

    this.lblName.string = UserMgr.inst.getRandomName();

    if (lobbyNet.type != 'http') {
      tgx.UIMgr.inst.showUI(UIChat, null, null, lobbyNet);
    }
  }

  onBtnRandomNameClicked() {
    this.lblName.string = UserMgr.inst.getRandomName(true);
  }

  onBtnAvatarClicked() {
    tgx.UIAlert.show('暂无可用皮肤');
  }

  async onBtnMatchClicked() {
    await GameSceneUtil.inst.enterGameLocally();
    return;
    const ret = await LobbyMgr.inst.rpc_QuickPlay('', true);
    if (ret.isSucc) {
      tgx.UIAlert.show('未找到适合的对手');
    } else {
      tgx.UIMgr.inst.showUI(UIGameMatching, async (ui: UIGameMatching) => {
        const params = ret.res;
        await GameSceneUtil.inst.enterGame(params, true);
      });
    }
    tgx.UIMgr.inst.showUI(UITeam);
  }

  update(deltaTime: number) {}
}
