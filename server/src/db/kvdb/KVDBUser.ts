import { TokenUtils } from '../../common/TokenUtils';
import { DBUser, DBUserInfo } from '../DBUserDef';
import { KVDB } from './KVDB';

const DB_USER = './.db_kv/db_users/db_user';
const DB_ACCOUNT = './.db_kv/db_accounts/db_account';
const DB_TOKEN = './.db_kv/db_tokens/db_token';

KVDB.initPath('./.db_kv/db_users');
KVDB.initPath('./.db_kv/db_accounts');
KVDB.initPath('./.db_kv/db_tokens');


export class KVDB_User implements DBUser {
    public async getUIDWithAccountAndPassword(account: string, password: string): Promise<string> {
        let info = KVDB.read(DB_ACCOUNT, account);
        if (!info) {
            return '';
        }

        let psd = TokenUtils.encodePassword(password);
        if (info.password != psd) {
            return '';
        }

        return info.uid;
    }

    public async hasUser(account: string): Promise<boolean> {
        let info = KVDB.read(DB_ACCOUNT, account);
        return info != null;
    }

    public async insterNewUser(account: string, password: string) {
        let uid = '';
        while (true) {
            uid = TokenUtils.genID(6, true);
            let info = KVDB.read(DB_USER, uid);
            if (!info) {
                break;
            }
        }

        let pswd = TokenUtils.encodePassword(password);
        let newUser = {
            account: account,
            uid: uid,
            name: '',
            roomId: '',
            gender: 0,
            introduction: '',
            coin: 0,
        };

        KVDB.update(DB_ACCOUNT, account, { uid: uid, password: pswd });
        KVDB.update(DB_USER, uid, newUser);
    }

    async getUserInfo(key: { uid?: string, token?: string }): Promise<Readonly<DBUserInfo | undefined>> {
        if (!key) {
            return undefined;
        }
        if (key.uid) {
            return this.getUserInfoByUid(key.uid);
        }
        else if (key.token) {
            return this.getUserInfoByToken(key.token);
        };
        return undefined;
    }

    updateUserInfo(key: { uid?: string, token?: string }, info: DBUserInfo) {
        if (!key) {
            return;
        }
        if (key.uid) {
            this.updateUserInfoByUid(key.uid, info);
        }
        else if (key.token) {
            this.updateUserInfoByToken(key.token, info);
        }
    }

    public async getUserInfoByUid(uid: string): Promise<Readonly<DBUserInfo | undefined>> {
        let userInfo = KVDB.read(DB_USER, uid);
        return userInfo
    }

    public async updateUserInfoByUid(uid: string, info: DBUserInfo) {
        let userInfo = KVDB.read(DB_USER, uid);
        if (!userInfo) {
            return;
        }

        if (info.token != undefined) {
            KVDB.delete(DB_TOKEN, userInfo.token);
            if (info.token) {
                KVDB.update(DB_TOKEN, info.token, { token: info.token, uid: uid });
            }
        }

        Object.keys(info).forEach(key => {
            userInfo[key] = (info as any)[key];
        });
        KVDB.update(DB_USER, uid, userInfo);
    }

    public async getUserInfoByToken(token: string): Promise<Readonly<DBUserInfo | undefined>> {
        let tokenInfo = KVDB.read(DB_TOKEN, token);
        if (!tokenInfo) {
            return;
        }
        return this.getUserInfoByUid(tokenInfo.uid);
    }

    public async updateUserInfoByToken(token: string, info: DBUserInfo) {
        let tokenInfo = KVDB.read(DB_TOKEN, token);
        if (!tokenInfo) {
            return;
        }
        this.updateUserInfoByUid(tokenInfo.uid, info);
    }

    public clearUserDataByUid(uid: string, key: string) {
        if (key == 'uid' || key == 'account' || key == 'password') {
            return;
        }

        let userInfo = KVDB.read(DB_USER, uid);
        if (!userInfo) {
            return;
        }

        delete userInfo[key];

        KVDB.update(DB_USER, uid, userInfo);
        if (key == 'token') {
            KVDB.delete(DB_TOKEN, userInfo.token);
        }
    }
}