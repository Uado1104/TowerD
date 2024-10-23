import { _decorator, assetManager, Component, Node, Vec3 } from 'cc';
import { ModuleDef } from '../scripts/ModuleDef';
import { NetGameServer } from '../module_basic/scripts/NetGameServer';
import { GameServerAuthParams } from '../module_basic/shared/types/GameServerAuthParams';
import { UserInfo } from '../module_basic/shared/types/UserInfo';
const { ccclass, property } = _decorator;


class MockClient{
    private net = new NetGameServer();
    private userInfo:UserInfo = {} as any;

    async startTest(index:number){


        let account = 'test_' + index;
        let password = '123456';

        this.net.startPing();
        this.net.createConnection(['ws://192.168.0.112:3001','ws://192.168.0.112:3002','ws://192.168.0.112:3003','ws://192.168.0.112:3004']);
        let ret = await this.net.ensureConnected();
        if(!ret.isSucc){
            console.log(ret.err.message);
            return;
        }

        await this.doLogin(account,password);
    }

    async doLogin(account,password){
        let net = this.net;
        let ret = await net.callApi('login/Login', { account: account, password: password });
        if(ret.isSucc){
            console.log('login success');
            this.userInfo = ret.res.userInfo;
            this.doAuth(ret.res.gameServerInfo);
        }
        else{
            this.enterRigster(account,password);
        }
    }

    async enterRoom(params: GameServerAuthParams) {

        this.net.authParams = params;
        let ret = await this.net.ensureConnected();
        if (!ret.isSucc) {
            return ret;
        }
        
        let ret2 = await this.net.joinRoomServer(this.userInfo.uid);
        if (ret2.isSucc) {
        }

        return ret2;
    }

    async doTryEnterRoom(id: string, password?: string) {
        let ret = await this.net.callApi('lobby/TryEnterRoom', { id: id, password: password }, { timeout: 10000 });
        
        if (ret.isSucc) {
            let params = ret.res;
            await this.net.connectToRoomServer(params);
            let ret2 = await this.enterRoom(params);
            if (ret2.isSucc) {
                console.log('is in game');
            }
        }
        else {
            console.log(ret.err.message);
        }
    
        return ret;
    }

    async doAuth(params: GameServerAuthParams) {
        if (params) {
            this.net.authParams = params;
            if (params.serverUrl != this.net.serverUrl) {
                this.net.createConnection([params.serverUrl]);
                let ret2 = await this.net.ensureConnected();
                if (!ret2.isSucc) {
                    console.log(ret2.err.message);
                    return ret2;
                }
            }

            let ret = await this.net.callApi('login/AuthClient', {
                uid: this.userInfo.uid,
                sign: params.token,
                time: params.time,
                roomId: params.roomId,
                gameType: params.gameType,
            });
            if (!ret.isSucc) {
                console.log(ret.err.message);
                return ret;
            }
        }

        //没有名字，表示还未创建角色，则进入角色创建流程
        if (!this.userInfo.name) {
            this.enterCreateRole();
        }
        //如果角色在房间中，则进入房间
        else if (params.roomId) {
            let ret2 = await this.doTryEnterRoom(params.roomId);
            if (!ret2.isSucc) {
                //进入大厅
                await this.enterLobby();
            }
        }
        else {
            //进入大厅
            await this.enterLobby();
        }
        return { isSucc: true };
    }

    async rpc_QuickPlay(type: string, immediate?: boolean) {
        let ret = await this.net.callApi("lobby/StartMatch", { type: type, immediate: immediate });
        return ret;
    }

    async enterLobby(){
        
        let ret = await this.rpc_QuickPlay('normal');
        if(ret.isSucc){
            this.enterRoom(ret.res);
        }
    }

    async enterRigster(account,password){
        let net = this.net;
        let ret = await net.callApi('login/Register', { account: account, password: password });
        if(!ret.isSucc){
            console.log('register failed');
        }
        else{
            this.doLogin(account,password);
        }
    }

    async enterCreateRole(){
        let name = '' + Math.random().toFixed(5);
        let visualId = 0;
        let ret = await this.net.callApi('login/CreateRole', { name: name, visualId: visualId });
        if (ret.isSucc) {
            this.userInfo.name = ret.res.name;
            this.userInfo.visualId = ret.res.visualId;
            this.enterLobby();
        }
    }
}

@ccclass('SceneTest')
export class SceneTest extends Component {
    private _initCompleted = false;
    start() {
        assetManager.loadBundle(ModuleDef.BASIC,(err,bundle)=>{
            this._initCompleted = true;
        });
    }

    private startMocking = false;
    private count = 0;
    update(deltaTime: number) {
        
    }

    async onStartTest(){
        if(!this._initCompleted){
            return;
        }
        this.startMocking = true;
        setInterval(()=>{
            if(this.startMocking && this.count < 1000){
                let client = new MockClient();
                client.startTest(this.count);
                this.count++;
            }
        },100);

    }
}

