export class GameConstants {
    //=============en:CONSTANSTS  zh:常量配置==============

    public static readonly MAX_TEAM_NUM = 10;
    public static readonly TEAM_MEMMBER_NUM = 5;
    public static readonly MAP_WIDTH = 10000;
    public static readonly MAP_HEIGHT = 10000;
    public static readonly MAP_GRID_SIZE = 1000;

    public static readonly MAP_WIDTH_GRID = Math.ceil(GameConstants.MAP_WIDTH / GameConstants.MAP_GRID_SIZE);
    public static readonly MAP_HEIGHT_GRID = Math.ceil(GameConstants.MAP_WIDTH / GameConstants.MAP_GRID_SIZE);
    //
    public static readonly MAX_WAIT_READY_TIME = 15000;
    public static readonly GAME_STATE_DURATION = {
        "waiting": Number.MAX_VALUE,
        "counting": 5000,
        "playing": 5 * 30 * 1000,
        "gameover": 15 * 1000, // room will closed in 15s
    };

    /**
     * @en the time to wait for real player to join, delay to add AI player
     * @zh 等待真人玩家加入的时间，延迟加入AI玩家
    */
    public static readonly DELAY_ADD_AI_TIME = 5000;

    /**
     * @en density of the player used for calculating size
     * @zh 玩家的密度，用于根据重量计算大小
     */
    public static readonly DENSITY = 0.01;

    /**
     *@en quick calculate factor
     *@zh 快速计算因子
     */
    public static readonly QUICK_CAL_FACTOR = GameConstants.DENSITY * Math.PI;

    /**
     * @en food type number
     * @zh 食物类型数量
    */
    public static readonly FOOD_TYPE_NUM = 5;

    public static readonly FOOD_SMALL_WEIGHT = 3;

    public static readonly FOOD_BIG_WEIGHT = 8;

    public static readonly FOOD_BIG_PROBABLITY = 0.1;

    public static readonly FOOD_MAX_NUM = 4000;
    /**
     * @en food random colors
     * @zh 食物随机颜色
    */
    public static readonly FOOD_COLORS = [
        0xFFFFFFFF,
        0xFF0000FF,
        0xFFFF00FF,
        0x01FF00FF,
        0x01FFFFFF,
        0x0100FFFF,
        0XFF00FFFF
    ];

    // =============================================
    //@en constants related to player unit
    //@zh 玩家单位相关的常量
    //==============================================

    /**
     * @en in ms, revive time  
     * @zh 单位毫秒，复活时间
     */
    public static readonly REVIVIE_CD = 5000;
    /**
     * @en ms, protected time after revive 
     * @zh 单位毫秒，复活后的保护时间
     */
    public static readonly PROTECT_TIME = 3000;

    public static readonly PLAYER_ORGINAL_WEIGHT = 50;
    public static readonly PLAYER_ORGINAL_RADIUS = Math.sqrt(GameConstants.PLAYER_ORGINAL_WEIGHT / GameConstants.QUICK_CAL_FACTOR);
    public static readonly PLAYER_ORGINAL_SPEED = 200;

    /**
     * @en player movement judgment factor, used for calculating the maximum allowable diviation value when the player moves 
     * @zh 玩家移动判定因子，用于计算玩家的移动时允许的最大偏差值
    */
    public static readonly PLAYER_MOVEMENT_BIAS_FACTOR = 0.5;

}