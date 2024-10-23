import mongoose from "mongoose"
import { DBMail, DBMailInfo } from "../DBMailDef";
import { TokenUtils } from "../../common/TokenUtils";
import { ServerGlobals } from "../../common/ServerGloabls";

// 2. 创建一个与 document interface 相对应的 Schema
const schema = new mongoose.Schema<DBMailInfo>({
    mailId: { type: String, required: true },
    uid: { type: String, required: true },
    from: { type: String, required: true },
    time: { type: Number, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    state: { type: String, required: false },
});


const DB_MAIL = 'DBMail';
// 定义 索引
schema.index({ mailId: 1 }, { unique: true });// 唯一索引
mongoose.model(DB_MAIL, schema);

const DBMailModel = mongoose.models[DB_MAIL];

/**
 * 数据库-邮件信息
 */
export class MongoDBMail implements DBMail {

    public async getMail(mailId: string):Promise<DBMailInfo> {
        let mailInfo = await DBMailModel.findOne({ mailId: mailId });
        return mailInfo;
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
    ////////// 定义 静态函数 //////////
    public async insterNewMail(from: string, to: string, title: string, content: string):Promise<DBMailInfo> {
        let DBMailModel = mongoose.models[DB_MAIL];
        /**
         * use server url + time + random to generate a unique token
         * 使用服务器 url + 时间戳 + 随机数 生成一个唯一的 token
        */
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
        return await DBMailModel.create(mailInfo) as DBMailInfo;
    }
    async deleteMail(mailId: string): Promise<boolean> {
        let mail_info = await DBMailModel.findOne({ mailId: mailId })
        if (!mail_info) {
            return false;
        }
        DBMailModel.deleteOne({ mailId: mailId })
        return true
    }

    async deleteMailMany(mailIds: string[]): Promise<boolean> {
        for(let i = 0; i < mailIds.length; ++i) {
            let mailId = mailIds[i];
            this.deleteMail(mailId);
        }
        return true
    }

    async markAsRead(mailId: string): Promise<boolean> {
        let mail_info = await DBMailModel.findOne({ mailId: mailId })
        if (!mail_info) {
            return false;
        }
        mail_info.state = 'read';
        mail_info.save()
        return true
    }
    async markAsReadMany(mailIds: string[]): Promise<boolean> {
        for(let i = 0; i < mailIds.length; ++i) {
            let mailId = mailIds[i];
            this.markAsRead(mailId);
        }
        return true;
    }
}