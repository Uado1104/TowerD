import { ApiCall } from "tsrpc";
import { basicConfig } from "../../configs/BasicConfig";
import { ReqGetBasicConfig, ResGetBasicConfig } from "../../shared/protocols/public/lobby/PtlGetBasicConfig";

export async function ApiGetBasicConfig(call: ApiCall<ReqGetBasicConfig, ResGetBasicConfig>) {
    call.succ(basicConfig);
}