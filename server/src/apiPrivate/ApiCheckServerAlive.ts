import { ApiCall } from "tsrpc";
import { ReqCheckServerAlive, ResCheckServerAlive } from "../privateProtocols/PtlCheckServerAlive";

export async function ApiCheckServerAlive(call: ApiCall<ReqCheckServerAlive, ResCheckServerAlive>) {
    call.succ({});
}