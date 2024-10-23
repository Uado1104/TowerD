import crypto from 'crypto';
import { GameServerAuthParams } from '../shared/types/GameServerAuthParams';
import { ServerGlobals } from './ServerGloabls';

const IDChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    'A', 'B', 'C', 'D', 'E', 'F', 'G',
    'H', 'I', 'J', 'K', 'L', 'M', 'N',
    'O', 'P', 'Q', 'R', 'S', 'T',
    'U', 'V', 'W', 'X', 'Y', 'Z'];

export class TokenUtils {

    public static genGameServerToken(uid: string, worldServerUrl: string, roomId: string, gameType: string, time: number) {
        let content = uid + worldServerUrl + roomId + gameType + time + ServerGlobals.secretKey;
        let token = crypto.createHash('md5').update(content).digest('hex');
        return token;
    }

    public static genID(len: number, numOnly?: boolean): string {
        let id = '';
        let charNum = numOnly ? 10 : IDChars.length;
        for (let i = 0; i < len; ++i) {
            id += IDChars[Math.floor(Math.random() * charNum)];
        }
        return id;
    }

    public static createEnterRoomParams(uid: string, worldServerUrl: string, roomId: string, gameType: string): GameServerAuthParams {
        let url = worldServerUrl;
        let time = Math.floor(Date.now() / 1000);
        let token = this.genGameServerToken(uid, url, roomId, gameType, time);
        return { roomId: roomId, gameType: gameType, serverUrl: url, token: token, time: time };
    }

    public static genReloginToken(uid: string, serverUrl: string, lastLoginTime: number) {
        let content = uid + serverUrl + lastLoginTime + ServerGlobals.secretKey;
        let token = crypto.createHash('md5').update(content).digest('hex');
        return token;
    }

    public static md5(content: string) {
        let md5 = crypto.createHash('md5').update(content).digest('hex');
        return md5;
    }

    //don't change the implemetation of this function.
    public static encodePassword(password: string) {
        /**@zh note: the key can't be changed once it is enabled, otherwise login will fail
         * @zh 注意：加密 key 一经启用则不能更改，否则会导致登录失败
        */
        let content = password + 'com.kylin.tgx.fullstack.games';
        return crypto.createHash('sha1').update(content).digest('base64');
    }
}