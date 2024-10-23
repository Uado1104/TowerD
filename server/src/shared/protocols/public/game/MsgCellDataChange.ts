export interface MsgCellDataChange {
    playerId?: number;
    //[x,y,z,rotation]
    transform?:number[];
    /**
     * @en force sync
     * @zh 强制同步
     */
    forceSync?:boolean;
    weight?:number;
    radius?:number;
    speed?:number;
    state?:''|'moving';
    protectedTime?:number;
}