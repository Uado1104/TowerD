export interface MsgPing {
    /**
     * @en client current timestamp, server will return it in MsgPong, used to calculate latency
     * @zh 客户端当前时间戳，服务端会在 MsgPong 中返回给客户端，用于计算延迟
    */
    timestamp:number,
}