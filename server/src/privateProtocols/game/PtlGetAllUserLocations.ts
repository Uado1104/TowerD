
/**
 * @en get all user locations on current server, master service will call this when start
 * @zh 获取当前服务器上所有的用户位置信息，Master 服务启动时会调用
*/

import { BaseRequest, BaseResponse, BaseConf } from "../../shared/protocols/base"

export interface ReqGetAllUserLocations extends BaseRequest {

}

export interface ResGetAllUserLocations extends BaseResponse {
    locations: {
        uid: string,
        roomId?: string,
        gameType?: string
    }[]
}

export const conf: BaseConf = {

}