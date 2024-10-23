import { dbMail, dbUser } from "../db/DBMgr";
import { DBUserInfo } from "../db/DBUserDef";

class MailSystem {
    async sendMail(from: string, to: string, title: string, content: string,userInfo?:DBUserInfo) {
        userInfo = userInfo || await dbUser.getUserInfoByUid(to);
        if(!userInfo){
            return;
        }

        let mail = await dbMail.insterNewMail(from, to, title, content);
        let mails = userInfo.mails || [];
        mails.push(mail.mailId);
        await dbUser.updateUserInfoByUid(userInfo.uid!, {mails:mails});
    }

    async deleteMail(mailId: string) {
        await dbMail.deleteMail(mailId);
    }

    async markAsRead(mailId: string) {
        await dbMail.markAsRead(mailId);
    }

    async cleanMails(mailIds: string[]) {
        await dbMail.deleteMailMany(mailIds);
    }
}

const mailSystem = new MailSystem();
export { mailSystem };