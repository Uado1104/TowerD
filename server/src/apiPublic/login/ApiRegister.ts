import { ApiCall } from "tsrpc";
import { ReqRegister, ResRegister } from "../../shared/protocols/public/login/PtlRegister";
import { dbUser } from "../../db/DBMgr";

export async function ApiRegister(call: ApiCall<ReqRegister, ResRegister>) {
    let hasUser = await dbUser.hasUser(call.req.account);

    if (hasUser) {
        call.error('USER_HAS_BEEN_EXIST');
        return;
    }

    await dbUser.insterNewUser(call.req.account, call.req.password);

    call.succ({});
}