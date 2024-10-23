export interface DBUserInfo {
    /**
    * @en token, used for HTTP access info
    * @zh 令牌，用于 HTTP 访问信息
    */
    token?: string
    /**
    * @en account id, unique in this server
    * @zh 账号
    */
    account?: string;
    /**
     * @en user id, unique in this server
     * @zh 用户唯一id
    */
    uid?: string;
    /**
     * @en user name
     * @zh 用户名
    */
    name?: string;
    /**
     * @en user visual id, used for headimg, etc.
     * @zh 用户外观，比如：头像ID 等
    */
    visualId?: number;
    /**
     * @en gender of user
     * @zh 用户性别
    */
    gender?: number,
    /**
     * @en user self introduction
     * @zh 用户自我介绍 
    */
    introduction?: string,
    /**
     * @en user's email list.
     * @zh 用户邮箱里的邮件ID
    */
    mails?: string[],

    /**
     * @en user's coin, used to buy items.
     * @zh 用户金币，用于购买道具等作用
    */
    coin?: number,
}

export interface DBUser {
    getUIDWithAccountAndPassword(account: string, password: string): Promise<string>;
    hasUser(account: string): Promise<boolean>;
    insterNewUser(account: string, password: string): void;
    getUserInfo(key: { uid?: string, token?: string }): Promise<Readonly<DBUserInfo | undefined>>;
    updateUserInfo(key: { uid?: string, token?: string }, info: DBUserInfo): void;
    getUserInfoByUid(uid: string): Promise<Readonly<DBUserInfo | undefined>>;
    updateUserInfoByUid(uid: string, info: DBUserInfo): void;
    getUserInfoByToken(token: string): Promise<Readonly<DBUserInfo | undefined>>;
    updateUserInfoByToken(token: string, info: DBUserInfo): void;
}