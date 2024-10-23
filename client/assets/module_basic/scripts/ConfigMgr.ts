import { BasicConfig } from "../shared/configs/BasicConfig";
import { lobbyNet } from "./NetGameServer";

export class ConfigMgr{
    private static _instance:ConfigMgr;
    public static get inst():ConfigMgr{
        if(!this._instance){
            this._instance = new ConfigMgr();
        }
        return this._instance;
    }
    
    private _basicConfig:BasicConfig | undefined;
    /**
     * @en get basic config
     * @zh 获取基础配置
    */
    public async getBasicConfig():Promise<BasicConfig | undefined>{
        if(!this._basicConfig){
            let ret = await lobbyNet.callApi("GetBasicConfig",{});
            if(ret.isSucc){
                this._basicConfig = ret.res;
            }
        }
        return this._basicConfig;
    }
}