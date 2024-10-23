import { ApiCall } from "tsrpc";
import { ReqGetAnnouncement, ResGetAnnouncement } from "../../shared/protocols/public/lobby/PtlGetAnnouncement";

/**
 * @en normally stored in database, and controlled by management system.
 * @zh 正式项目中，一般存放在数据库，并通过管理后台修改
*/
const announcementMap: { [key: string]: string } = {}

announcementMap['lobby'] = '欢迎进入球球大乱斗 IO 游戏，出海、多人联机、小游戏、H5平台等轻量休闲竞技的绝佳品类，合作加微信：qilinzi6666';

export async function ApiGetAnnouncement(call: ApiCall<ReqGetAnnouncement, ResGetAnnouncement>) {
    let content = announcementMap[call.req.type] || '';

    call.succ({ content: content });
}