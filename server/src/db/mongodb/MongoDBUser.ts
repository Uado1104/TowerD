import mongoose from "mongoose"
import { DBUser, DBUserInfo } from "../DBUserDef";
import { TokenUtils } from "../../common/TokenUtils";

interface DBAccountInfo {
    account: string;
    password: string;
    uid: string;
}

const accountSchema = new mongoose.Schema<DBAccountInfo>({
    account: { type: String, required: true },
    password: { type: String, required: false },
    uid: { type: String, required: true }
});

const DBAccountModel = mongoose.model("DBAccount", accountSchema);
accountSchema.index({ account: 1 }, { unique: true });// 唯一索引

// 2. 创建一个与 document interface 相对应的 Schema
const schema = new mongoose.Schema<DBUserInfo>({
    token: { type: Number, required: true },
    account: { type: String, required: true },
    uid: { type: String, required: true },
    name: { type: String, required: false },
    visualId: { type: Number, required: false },
    gender: { type: Number, required: false },
    introduction: { type: String, required: false },
    mails: { type: [String], required: false },
    coin: { type: Number, required: true },
});

// 定义 索引
schema.index({ uid: 1 }, { unique: true });// 唯一索引

// 注册文档模块
const DBUserModel = mongoose.model("DBUser", schema);

/**
 * 数据库-用户信息
 */
export class MongoDBUser implements DBUser {
    /**
     * 获取用户信息 通过密码
     * @param account 
     * @param password 
     * @returns 
     */
    async getUIDWithAccountAndPassword(account: string, password: string): Promise<string> {

        let accountInfo = await DBAccountModel.findOne({ account: account });
        if (!accountInfo) {
            return '';
        }

        let psd = TokenUtils.encodePassword(password);
        if (accountInfo.password != psd) {
            return '';
        }

        return accountInfo.uid;
    }

    public async hasUser(account: string): Promise<boolean> {
        let user_info = await DBAccountModel.findOne({ account: account });
        return user_info != null;
    }

    async insterNewUser(account: string, password: string) {
        let uid = '';
        while (true) {
            uid = TokenUtils.genID(6, true);
            let user_info = await DBUserModel.findOne({ uid: uid });
            if (!user_info) {
                break;
            }
        }
        let newUser: DBUserInfo = {
            account: account,
            uid: uid,
            name: '',
            gender: 0,
            introduction: '',
            visualId: 0,
            mails: [],
            coin: 0,
        };
        let pswd = TokenUtils.encodePassword(password);
        await DBAccountModel.create({ account: account, password: pswd, uid: uid });
        await DBUserModel.create(newUser);
    }

    async getUserInfo(key: { uid?: string, token?: string }):Promise<Readonly<DBUserInfo | undefined>>{
        if(!key){
            return undefined;
        }
        if(key.uid){
            return this.getUserInfoByUid(key.uid);
        }
        else if(key.token){
            return this.getUserInfoByToken(key.token);
        };
        return undefined;
    }

    updateUserInfo(key: { uid?: string, token?: string }, info: DBUserInfo) {
        if(!key){
            return;
        }
        if(key.uid){
            this.updateUserInfoByUid(key.uid, info);
        }
        else if(key.token){
            this.updateUserInfoByToken(key.token, info);
        }
    }

    async getUserInfoByUid(uid: string): Promise<Readonly<DBUserInfo> | undefined> {
        let user_info = await DBUserModel.findOne({ uid: uid });
        if (!user_info) {
            return;
        }
        return user_info
    }
    async updateUserInfoByUid(uid: string, new_user_info: DBUserInfo) {
        let user_model = await DBUserModel.findOne({ uid: uid });
        if (!user_model) {
            return;
        }
        Object.keys(new_user_info).forEach(key => {
            (user_model as any)[key] = (new_user_info as any)[key];
        });
        user_model.save()
    }

    async getUserInfoByToken(token: string): Promise<Readonly<DBUserInfo> | undefined> {
        let user_info = await DBUserModel.findOne({ token: token });
        if (!user_info) {
            return;
        }
        return user_info
    }

    async updateUserInfoByToken(token: string, new_user_info: DBUserInfo) {
        let user_model = await DBUserModel.findOne({ token: token });
        if (!user_model) {
            return;
        }
        Object.keys(new_user_info).forEach(key => {
            (user_model as any)[key] = (new_user_info as any)[key];
        });
        user_model.save()
    }
}