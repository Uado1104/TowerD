import { GameUILayers } from "../../scripts/GameUILayers";
import { ModuleDef } from "../../scripts/ModuleDef";
import { loginNet } from "../scripts/NetGameServer";
import { NetUtil } from "../scripts/NetUtil";
import { UILogin, UIRegister } from "../ui_login/UILogin";
import { Layout_UIRegister } from "./Layout_UIRegister";

@tgx_class(ModuleDef.BASIC, UIRegister)
export class UIRegister_Impl extends UIRegister {
    constructor() {
        super('ui_register/ui_register', GameUILayers.POPUP, Layout_UIRegister);
    }

    protected onCreated(): void {
        let layout = this._layout as Layout_UIRegister;
        this.onButtonEvent(layout.btnBackToLogin,()=>{
            this.close();
            tgx.UIMgr.inst.showUI(UILogin);
        });

        this.onButtonEvent(layout.btnRegister,()=>{
            if(layout.edtAccount.string.length < 4){
                tgx.UIAlert.show('用户名至少需要 4 个字符！');
                return;
            }
            if(layout.edtPassword.string.length < 6){
                tgx.UIAlert.show('密码至少需要 6 个字符！');
                return;
            }
            if(layout.edtPassword.string != layout.edtPasswordConfirm.string){
                tgx.UIAlert.show('两次密码不一样！');
                return;
            }

            this.doRegister(layout.edtAccount.string, layout.edtPassword.string);
        });
    }

    async doRegister(account:string,password:string){
        tgx.UIWaiting.show('注册中');
        let serverList = await NetUtil.getGameServerList();
        loginNet.createConnection(serverList);
        let ret = await loginNet.callApi('login/Register', {account:account,password:password});
        tgx.UIWaiting.hide();
        if (!ret.isSucc) {
            if(ret.err.message == 'USER_HAS_BEEN_EXIST'){
                tgx.UIAlert.show('用户名已被使用！');
            }
            return;
        }

        tgx.UIAlert.show('注册成功，返回登录').onClick(()=>{
            this.close();
            tgx.UIMgr.inst.showUI(UILogin,((ui:UILogin)=>{
                ui.autoFill(account,password);
            }));
        });
    }
}