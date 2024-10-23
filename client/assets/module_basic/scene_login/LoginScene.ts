import { _decorator, Component, Director, director, Node, sys } from 'cc';
import { UILogin } from '../ui_login/UILogin';
import { SceneDef } from '../../scripts/SceneDef';
import { NetUtil } from '../scripts/NetUtil';
import { lobbyNet } from '../scripts/NetGameServer';
import { LobbyMgr } from '../scripts/LobbyMgr';
const { ccclass, property } = _decorator;

@ccclass('LoginScene')
export class LoginScene extends Component {
    async start() {

        tgx.UIMgr.inst.closeAll();

        if(sys.isBrowser){
            let params = tgx.URLUtils.urlParse(window.location?.href);
            let account = params['a'];
            let password = params['p'];
            if(account && password){
                let ret = await LobbyMgr.inst.doLogin(account, password);
                if(ret.isSucc){
                    return;
                }
            }
        }
        tgx.UIMgr.inst.closeAll();
        tgx.UIMgr.inst.showUI(UILogin);
    }

    protected onDestroy(): void {
    }

    update(deltaTime: number) {
        
    }
}