import { SceneDef } from '../../scripts/SceneDef';
import { HttpLobbyServer, NetLobbyServer, lobbyNet, loginNet } from './NetGameServer';
import { GameSceneUtil } from './GameSceneUtil';
import { UserLocalCache } from './UserLocalCache';
import { UserMgr } from './UserMgr';
import { NetUtil } from './NetUtil';

export class LobbyMgr {
  private static _inst: LobbyMgr;
  public static get inst(): LobbyMgr {
    if (!this._inst) {
      this._inst = new LobbyMgr();
    }
    return this._inst;
  }

  constructor() {
    tgx.AudioMgr.inst.musicVolume = UserLocalCache.inst.musicVolume;
    tgx.AudioMgr.inst.soundVolume = UserLocalCache.inst.soundVolume;

    if (lobbyNet.type == 'http') {
      (lobbyNet as HttpLobbyServer).addErrorFilter('INVALID_TOKEN', () => {
        tgx.UIAlert.show('TOKEN 过期，请重新登录').onClick(() => {
          tgx.SceneUtil.loadScene(SceneDef.LOGIN);
        });
      });
      (lobbyNet as HttpLobbyServer).addErrorFilter('UNKNOWN_ERROR', () => {
        tgx.UIAlert.show('系统错误，请重新登录').onClick(() => {
          tgx.SceneUtil.loadScene(SceneDef.LOGIN);
        });
      });
    }
  }

  async doLogin(account: string, password: string) {
    const serverList = await NetUtil.getGameServerList();
    loginNet.createConnection(serverList);

    const ret = await loginNet.callApi('login/Login', { account: account, password: password });
    if (ret.isSucc) {
      lobbyNet.authParams = ret.res;
      const authRet = await this.doAuth();
      if (!authRet.isSucc) {
        return authRet;
      }
    } else {
      if (ret.err.message == 'USER_NOT_EXISTS' || ret.err.message == 'PASSWORD_WRONG') {
        tgx.UIAlert.show('用户名或者密码错误！');
      } else {
        tgx.UIAlert.show(ret.err.message);
      }
    }
    return ret;
  }

  public async backToLobby() {
    const ret = await this.doAuth();
    if (!ret.isSucc) {
    }
  }

  async doAuth() {
    if (!lobbyNet.authParams) {
      return { isSucc: false };
    }

    lobbyNet.createConnection([lobbyNet.authParams.lobbyUrl]);

    if (lobbyNet.type != 'http') {
      const net = lobbyNet as NetLobbyServer;
      const ret2 = await net.ensureConnected();
      if (!ret2.isSucc) {
        tgx.UIAlert.show(ret2.err.message);
        return ret2;
      }
    }

    const ret = await lobbyNet.callApi('lobby/Auth', lobbyNet.authParams);
    if (!ret.isSucc) {
      tgx.UIAlert.show(ret.err.message);
      return ret;
    }

    UserMgr.inst.setUserInfo(ret.res.userInfo);

    //没有名字，表示还未创建角色，则进入角色创建流程
    if (!UserMgr.inst.name) {
      tgx.UIWaiting.show('角色准备中');
      await tgx.SceneUtil.loadScene(SceneDef.CREATE_ROLE);
    } else if (ret.res.roomId) {
      //如果角色在房间中，则进入房间
      const ret2 = await this.doTryEnterRoom(ret.res.roomId);
      if (!ret2.isSucc) {
        //进入大厅
        await tgx.SceneUtil.loadScene(SceneDef.LOBBY);
      }
    } else {
      //进入大厅
      await tgx.SceneUtil.loadScene(SceneDef.LOBBY);
    }
    return { isSucc: true };
  }

  async rpc_CreateRole(name: string, visualId: number) {
    const ret = await lobbyNet.callApi('lobby/CreateRole', { name: name, visualId: visualId });
    if (ret.isSucc) {
      UserMgr.inst.setUserInfo({ name: ret.res.name, visualId: ret.res.visualId } as any);
    }
    return ret;
  }

  async doTryEnterRoom(id: string, password?: string) {
    tgx.UIWaiting.show('进入世界');
    const ret = await lobbyNet.callApi('lobby/TryEnterRoom', { id: id, password: password }, { timeout: 10000 });
    tgx.UIWaiting.hide();

    if (ret.isSucc) {
      const params = ret.res;
      tgx.UIWaiting.show('进入世界');
      return await GameSceneUtil.instance.enterGame(params);
    } else {
      tgx.UIAlert.show(ret.err.message);
    }
    return ret;
  }

  async rpc_QuickPlay(type: string, immediate?: boolean) {
    const ret = await lobbyNet.callApi('lobby/StartMatch', { type: type, immediate: immediate });
    return ret;
  }

  async rpc_QuickPlayCancel() {
    const ret = await lobbyNet.callApi('lobby/CancelMatch', {});
    return ret;
  }

  async rpc_CreateRoom(type: string, name: string, password: string) {
    const ret = await lobbyNet.callApi('lobby/CreateRoom', { roomName: name, gameType: type, password: password });
    return ret;
  }

  async rpc_GetAnnouncement(type: string) {
    const ret = await lobbyNet.callApi('lobby/GetAnnouncement', { type: type });
    return ret;
  }

  async rpc_GetNotice() {
    const ret = await lobbyNet.callApi('lobby/GetNotice', {});
    return ret;
  }
}
