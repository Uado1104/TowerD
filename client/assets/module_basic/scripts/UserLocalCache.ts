
const KEY_ACCOUNT = 'user:account';
const KEY_PASSWORD = 'user:password';

const KEY_MUSIC_VOLUME = 'user:music_volume';
const KEY_SOUND_VOLUME = 'user:sound_volume';

const KEY_ROLE_NAME = 'user:role_name:';

export class UserLocalCache {
    private static _inst: UserLocalCache;
    public static get inst(): UserLocalCache {
        if (!this._inst) {
            this._inst = new UserLocalCache();
        }
        return this._inst;
    }

    public get account(): string {
        return localStorage.getItem(KEY_ACCOUNT);
    }

    public get password(): string {
        return localStorage.getItem(KEY_PASSWORD);
    }

    public getRoleName(uid:string):string{
        return localStorage.getItem(KEY_ROLE_NAME+uid);
    }

    public storeAccount(account: string) {
        localStorage.setItem(KEY_ACCOUNT, account);
    }

    public storePassword(password: string) {
        localStorage.setItem(KEY_PASSWORD, password);
    }

    public storeRoleName(uid:string,name:string){
        localStorage.setItem(KEY_ROLE_NAME+uid,name);
    }


    public set musicVolume(v: number) {
        localStorage.setItem(KEY_MUSIC_VOLUME, v.toString());
    }

    public get musicVolume(): number {
        return Number(localStorage.getItem(KEY_MUSIC_VOLUME) || '1.0');
    }

    public set soundVolume(v: number) {
        localStorage.setItem(KEY_SOUND_VOLUME, v.toString());
    }

    public get soundVolume(): number {
        return Number(localStorage.getItem(KEY_SOUND_VOLUME) || '1.0');
    }
}