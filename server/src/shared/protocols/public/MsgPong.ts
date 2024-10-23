export interface MsgPong {
    /**
     * @en client timestamp when sending MsgPing, the server will return it in MsgPong, used to calculate latency
     * @zh 客户端发送 MsgPing 时的时间戳，服务端返回给客户端，用于计算网络延迟
    */
    timestamp:number   
}
