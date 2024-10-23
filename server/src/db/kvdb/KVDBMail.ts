
import { ServerGlobals } from '../../common/ServerGloabls';
import { TokenUtils } from '../../common/TokenUtils';
import { DBMail, DBMailInfo } from '../DBMailDef';
import { KVDB } from './KVDB';
/**
 * @en initialize KV database
 * @zh 初始化KV数据库
*/
const DB_MAIL = './.db_kv/db_mails/db_mail';
KVDB.initPath('./.db_kv/db_mails');

export class KVDB_Mail implements DBMail {

    public async getMail(mailId: string):Promise<DBMailInfo> {
        return KVDB.read(DB_MAIL, mailId) as DBMailInfo;
    }

    public async getMailMany(mailIds: string[] | undefined):Promise<DBMailInfo[]> {
        if (!mailIds || mailIds.length == 0) {
            return [];
        };

        let ret = new Array(mailIds.length);
        for (let i = 0; i < mailIds.length; ++i) {
            let mailId = mailIds[i];
            ret[i] = (await this.getMail(mailId));
        }

        return ret;
    }

    public async insterNewMail(from: string, to: string, title: string, content: string):Promise<DBMailInfo> {
        let mailId = TokenUtils.md5(ServerGlobals.uuid + Date.now() + Math.random());
        let mailInfo = {
            mailId: mailId,
            uid: to,
            from: from,
            time: Date.now(),
            title: title,
            content: content,
            state: '',
        };

        KVDB.update(DB_MAIL, mailInfo.mailId, mailInfo);

        return mailInfo;
    }

    public async deleteMail(mailId: string):Promise<boolean> {
        KVDB.delete(DB_MAIL, mailId);
        return true;
    }

    public async deleteMailMany(mailIds: string[]):Promise<boolean> {
        for (let i = 0; i < mailIds.length; ++i) {
            let mailId = mailIds[i];
            KVDB.delete(DB_MAIL, mailId);
        }
        return true;
    }

    public async markAsRead(mailId: string):Promise<boolean> {
        let mailInfo = await this.getMail(mailId);
        if (mailInfo) {
            mailInfo.state = 'read';
        }
        KVDB.update(DB_MAIL, mailId, mailInfo);
        return true;
    }

    public async markAsReadMany(mailIds: string[] | undefined):Promise<boolean> {
        if (!mailIds) {
            return false;
        }
        for (let i = 0; i < mailIds.length; ++i) {
            let mailId = mailIds[i];
            this.markAsRead(mailId);
        }
        return true;
    }
}