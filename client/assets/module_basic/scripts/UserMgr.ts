import { Sprite, Label, resources, ImageAsset, Texture2D, SpriteFrame, assetManager } from "cc";
import { UserInfo } from "../shared/types/UserInfo";
import { lobbyNet } from "./NetGameServer";
import { UserLocalCache } from "./UserLocalCache";
import { SpriteUtils } from "./SpriteUtils";

const NAMES_PREFIX = [
    "神秘的", "勇敢的", "活泼的", "机智的", "冷静的", "优雅的", "狂野的", "聪明的", "忠诚的", "奔放的",
    "威严的", "敏捷的", "热情的", "坚定的", "宁静的", "强大的", "好奇的", "温和的", "活泼的", "无畏的"
];

const NAMES = [
    "晨风", "星辰", "云起", "月影", "风行", "寒霜", "炎舞", "秋叶", "碧落", "雷鸣", "流光", "雪见", "岩松", "梦露", "灵溪",
    "林风语", "寒江雪", "碧水寒", "烈焰行", "星辰变", "风中翼", "月下影", "雷霆怒", "梦无痕", "秋水寒", "流云飞", "雪中舞", "岩谷风", "梦境花", "灵山月",
];

export class UserMgr {
    private static _inst: UserMgr;
    public static get inst(): UserMgr {
        if (!this._inst) {
            this._inst = new UserMgr();
        }
        return this._inst;
    }

    constructor() {
    }

    private _userInfo: UserInfo = {
        uid: '',
        name: '',
        visualId: 0,
        gender: 0,
        introduction: '',
    }

    private _roomId: string;

    private _userInfoMap: { [key: string]: UserInfo } = {};

    public getRandomName(randomNew:boolean = false){
        if(!randomNew){
            return UserLocalCache.inst.getRoleName(this.uid) || this.getRandomName(true);
        }
        let pre = NAMES_PREFIX[Math.floor(Math.random() * NAMES_PREFIX.length)];
        let name = pre + NAMES[Math.floor(Math.random() * NAMES.length)];
        UserLocalCache.inst.storeRoleName(this.uid,name);
        return name;
    }

    public setUserInfo(info: UserInfo) {
        for (let key in info) {
            this._userInfo[key] = info[key];
        }
        this._userInfoMap[this._userInfo.uid] = this._userInfo;
    }

    public get uid(): string {
        return this._userInfo.uid;
    }
    
    public get name(): string {
        return this._userInfo.name;
    }

    public get visualId(): number {
        return this._userInfo.visualId;
    }

    public get roomId(): string {
        return this._roomId;
    }

    public get coin():number{
        return this._userInfo.coin || 0;
    }


    async setUserIconAndName(userId: string, sprIcon: Sprite, lblName?: Label, bundleName?: string) {
        if (!sprIcon && !lblName) {
            return;
        }
        let info = await this.rpc_GetUserInfo(userId);
        if (!info) {
            return;
        }
        if (lblName && lblName.isValid) {
            lblName.string = info.name || 'User_' + userId;
        }
        if (sprIcon && sprIcon.isValid) {
            SpriteUtils.setUserIcon(sprIcon,info.visualId, bundleName);
        }
    }

    async rpc_GetUserInfo(userId: string) {
        let info = this._userInfoMap[userId];
        if (info) {
            return info as UserInfo;
        }

        if(!userId){
            return null;
        }

        let ret = await lobbyNet.callApi('lobby/GetUserInfo', { uid: userId });
        if (!ret.isSucc || !ret.res.infos.length) {
            return null;
        }

        info = ret.res.infos[0];
        this._userInfoMap[info.uid] = info;

        return info;
    }

    async rpc_GetUserInfos(userIds: Array<string>) {
        let uncachedIds = [];
        for (let i = 0; i < userIds.length; ++i) {
            let userId = userIds[i];
            if (!this._userInfoMap[userId]) {
                uncachedIds.push(userId);
            }
        }
        if (uncachedIds.length == 0) {
            return this._userInfoMap;
        }

        let ret = await lobbyNet.callApi('lobby/GetUserInfo', { uids: uncachedIds });

        if (!ret.isSucc || !ret.res.infos.length) {
            return null;
        }

        for (let i = 0; i < ret.res.infos.length; ++i) {
            let info = ret.res.infos[i];
            this._userInfoMap[info.uid] = info;
        }

        return this._userInfoMap;
    }

    async rpc_ModifyUserInfo(gender: number | undefined, introduction: string | undefined) {
        let ret = await lobbyNet.callApi("lobby/ModifyUserInfo", { gender: gender, introduction: introduction });
        if (ret.isSucc) {
            if (ret.res.gender != undefined) {
                this._userInfo.gender = ret.res.gender;
            }
            if (ret.res.introduction != undefined) {
                this._userInfo.introduction = ret.res.introduction;
            }
        }
        return ret;
    }
}