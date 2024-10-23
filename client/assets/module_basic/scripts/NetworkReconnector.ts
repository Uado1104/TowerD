import { _decorator, Component, Director, director, Node } from 'cc';
import { gameNet, lobbyNet, NetGameServer, NetLobbyServer } from './NetGameServer';
import { WebsocketClient } from './WebsocketClient';
import { GameSceneUtil } from './GameSceneUtil';
import { UserMgr } from './UserMgr';
import { SceneDef } from '../../scripts/SceneDef';
import { RoomMgr } from './RoomMgr';
import { EDITOR, PREVIEW } from 'cc/env';
import { GameMgr } from './GameMgr';
import { LobbyMgr } from './LobbyMgr';
const { ccclass, property } = _decorator;

//主动添加到所有场景。
director.on(Director.EVENT_AFTER_SCENE_LAUNCH, () => {
    if (EDITOR && PREVIEW || !EDITOR) {
        if (director.getScene().getChildByName('NetworkReconnector')) {
            throw new Error('NetworkReconnector can only be added by code, please remove from scene:.' + director.getScene().name);
        }
        let node = new Node('NetworkReconnector');
        node.addComponent(NetworkReconnector);
        director.getScene().addChild(node);
    }
});

@ccclass('NetworkReconnector')
export class NetworkReconnector extends Component {
    start() {
        this.schedule(() => {
            this.checkNetwork();
        }, 1.0);
    }

    public get isInGame() {
        return director.getScene().name.indexOf('game_') == 0;
    }

    private _tryTimes = 0;

    needReconnect(v: { code?: number, reason?: string, isManual?: boolean }) {
        if(!v){
            return true;
        }
        if (v.reason == 'login_to_other') {
            this.enabled = false;
            tgx.UIAlert.show('账号在其他地方登录！').onClick(() => {
                tgx.SceneUtil.loadScene(SceneDef.LOGIN);
            });
            return false;
        }
        if (v.reason == 'normal' || v.reason == 'room_closed') {
            return false;
        }
        if (v.isManual) {
            return false;
        }
        return true;
    }

    private _isReconnecting = false;
    private checkNetwork(): void {

        if (this.isInGame) {
            if (gameNet.conn && !this._isReconnecting && !gameNet.conn.isConnected) {
                if (this.needReconnect(gameNet.lastDisconnectReason)) {
                    this._isReconnecting = true;
                    this.enabled = false;
                    this.tryReconnect(gameNet);
                }
            }
        }
        else {
            if(lobbyNet.type != 'http'){
                let net = lobbyNet as NetLobbyServer;
                if (net.conn && !this._isReconnecting && !net.conn.isConnected) {
                    if (this.needReconnect(net.lastDisconnectReason)) {
                        this._isReconnecting = true;
                        this.enabled = false;
                        this.tryReconnect(net);
                    }
                }
            }
        }
    }

    private async tryReconnect(net: WebsocketClient) {
        this._tryTimes++;
        if (this._tryTimes > 10) {
            tgx.UIWaiting.hide();
            this.enabled = false;
            tgx.UIAlert.show('请检查网络，重新登录！').onClick(() => {
                tgx.SceneUtil.loadScene(SceneDef.LOGIN);
            });
            return;
        }
        let isSucc = false;
        if (this.isInGame) {
            if (net == gameNet) {
                console.log('game reconnecting.');
                tgx.UIWaiting.show('正在重连');
                let ret = await GameSceneUtil.inst.enterGame(gameNet.authParams);
                if (ret.isSucc) {
                    isSucc = true;
                }
                else if (ret.err.code == 'ROOM_NOT_EXISTS') {
                    RoomMgr.inst.backToLobby();
                    return;
                }
            }
        }
        else {
            console.log('lobby reconnecting.');
            tgx.UIWaiting.show('正在重连');
            let ret = await net.ensureConnected();
            isSucc = ret.isSucc;
            /**
             * @en if already login success, need to verify again
             * @zh 如果已经登录成功，则需要再次验证
            */
            if (ret.isSucc) {
                let ret1 = await LobbyMgr.inst.doAuth();
                if (!ret1.isSucc) {
                    tgx.UIWaiting.hide();
                    this.enabled = false;
                    tgx.UIAlert.show("请检查网络，重新登录！").onClick(bOK => {
                        tgx.SceneUtil.loadScene(SceneDef.LOGIN);
                    });
                    return;
                }
            }
        }

        /**
         * @en if re-connect failed, try again after 3s
         * @zh 如果没有重连成功，则一定时间后再次尝试
        */
        if (!isSucc) {
            setTimeout(() => {
                this.tryReconnect(net);
            }, 3000);
        }
    }
}

