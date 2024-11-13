import { RoomMgr } from './RoomMgr';
import { GameServerAuthParams } from '../shared/types/GameServerAuthParams';
import { GameMgr } from './GameMgr';
import { NetLobbyServer, gameNet, lobbyNet } from './NetGameServer';
import { ModuleDef } from '../../scripts/ModuleDef';
import { SceneDef } from '../../scripts/SceneDef';

export class GameSceneUtil {
  private static _inst: GameSceneUtil;
  static get inst(): GameSceneUtil {
    if (!this._inst) {
      this._inst = new GameSceneUtil();
    }
    return this._inst;
  }

  private _stage = 'lobby';
  get stage(): string {
    return this._stage;
  }

  async enterGameLocally() {
    // 改成直接加载游戏场景
    // 改成直接加载游戏场景
    this._stage = 'normal';
    await tgx.SceneUtil.loadBundleSync(ModuleDef.GAME);

    RoomMgr.inst.reset();
    GameMgr.inst.reset();
    await tgx.SceneUtil.loadScene(SceneDef.GAME);
  }

  async enterGame(params: GameServerAuthParams, silence = false) {
    // 改成直接加载游戏场景
    // 改成直接加载游戏场景
    this._stage = 'normal';
    if (!silence) {
      tgx.UIWaiting.show('正在加载');
    }
    await tgx.SceneUtil.loadBundleSync(ModuleDef.GAME);

    RoomMgr.inst.reset();
    GameMgr.inst.reset();

    await gameNet.connectToRoomServer(params);
    const ret = await RoomMgr.inst.enterRoom(params);
    if (ret.isSucc) {
      const loadRet = await tgx.SceneUtil.loadScene(SceneDef.GAME);
      if (loadRet && lobbyNet.type != 'http') {
        (lobbyNet as NetLobbyServer).disconnect(3000, 'normal');
      }
    } else {
      if (ret.err.message == 'INVALID_CALL' || ret.err.message == 'not_login') {
        RoomMgr.inst.backToLobby();
      }
    }
    return ret;
  }

  exitGame() {
    this._stage = 'lobby';
    RoomMgr.inst.reset();
    GameMgr.inst.reset();
    tgx.SceneUtil.unloadBundle(ModuleDef.GAME);
  }
}
