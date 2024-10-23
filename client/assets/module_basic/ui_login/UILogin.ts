import { GameUILayers } from "../../scripts/GameUILayers";
import { ModuleDef } from "../../scripts/ModuleDef";
import { LobbyMgr } from "../scripts/LobbyMgr";
import { UserLocalCache } from "../scripts/UserLocalCache";
import { Layout_UILogin } from "./Layout_UILogin";

export class UIRegister extends tgx.UIController{}

@tgx_class(ModuleDef.BASIC)
export class UILogin extends tgx.UIController {
    constructor() {
        super('ui_login/ui_login', GameUILayers.POPUP, Layout_UILogin);
    }

    private _oldAccount = '';
    private _oldPassword = '';

    protected onCreated(): void {
        let layout = this._layout as Layout_UILogin;
        this.onButtonEvent(layout.btnLogin, () => {
            let newAccount = layout.edtAccount.string;
            let newPassword = layout.edtPassword.string;
            if (newAccount != this._oldAccount || newPassword != this._oldPassword) {
                //if account or password has been changed, alert to store.
                tgx.UIAlert.show('是否保存账号和密码？', true).onClick((ok: boolean) => {
                    if (ok) {
                        UserLocalCache.inst.storeAccount(layout.edtAccount.string);
                        UserLocalCache.inst.storePassword(layout.edtPassword.string);
                    }
                    this.doLogin(newAccount, newPassword);
                });
            }
            else {
                this.doLogin(newAccount, newPassword);
            }
        });

        this.onButtonEvent(layout.btnRegister, () => {
            this.close();
            tgx.UIMgr.inst.showUI(UIRegister);
        });

        let params = tgx.URLUtils.urlParse(window.location?.href);
        

        let cachedAccount = params['a'] || UserLocalCache.inst.account;
        if (cachedAccount) {
            layout.edtAccount.string = cachedAccount;
        }

        let cachedPassword = params['p'] || UserLocalCache.inst.password;
        if (cachedPassword) {
            layout.edtPassword.string = cachedPassword;
        }

        //store them for later comparison.
        this._oldAccount = layout.edtAccount.string;
        this._oldPassword = layout.edtPassword.string;
    }

    autoFill(account: string, password: string) {
        let layout = this._layout as Layout_UILogin;
        layout.edtAccount.string = account;
        layout.edtPassword.string = password;
    }

    async doLogin(account: string, password: string) {
        tgx.UIWaiting.show('正在登录');
        let ret = await LobbyMgr.inst.doLogin(account, password);
        if(!ret.isSucc){
            tgx.UIWaiting.hide();
        }
    }
}