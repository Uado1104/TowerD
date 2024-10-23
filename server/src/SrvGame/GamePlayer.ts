import { IGamePlayer } from "../shared/protocols/public/game/GameTypeDef";

export class GamePlayer implements IGamePlayer {
    gridsIndex:number[] = [];
    /**
     * @en user id, corresponding to the uid in database
     * @zh 用户 id，对应数据库中的 uid 
    */
    public uid: string = '';
    /**
     * @zh the color of player, used to distinguish different camp
     * @zh 玩家颜色，用于区别不同阵营
    */
    color: number = 0;
    /**
     * @en player id, use playerId instead of uid, because playerId in number type is more bandwidth-saving
     * @zh 玩家唯一 id。游戏逻辑使用 playerId 而不是 uid，因为 playerId 更省带宽
    */
    playerId: number = 0;
    roleName: string = '';
    location: string = '';
    /**
     * @en [x,y,z,rotation]
     * @zh [x,y,z,旋转]
    */
    transform: number[] = [0, 0, 0, 0];
    /**
     * @en <= 0: alive, > 0: dead
     * @zh 复活时间 <= 0 活着 > 0 死亡
    */
    reviveTime: number = 0;

    deadTimestamp: number = 0;
    protectedTime: number = 0;

    weight: number = 0;
    radius: number = 0;
    speed: number = 0;
    teamId: number = -1;

    isAI: boolean = false;
    dirX: number = 0;
    dirY: number = 0;

    //for ai
    lastChangeDirTime: number = 0;
    state: "" | "moving" = "";

    public get x() { return this.transform[0]; }
    public set x(val:number) { this.transform[0] = val; }
    public get y() { return this.transform[1]; }
    public set y(val:number) { this.transform[1] = val; }
    public get z() { return this.transform[2]; }
    public set z(val:number) { this.transform[2] = val; }
    public get rotation() { return this.transform[3]; }
    public set rotation(val:number) { this.transform[3] = val; }
}