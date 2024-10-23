const TEAM_ID_TABLE = [
    { id: 1, name: '鼠' },
    { id: 2, name: '牛' },
    { id: 3, name: '虎' },
    { id: 4, name: '兔' },
    { id: 5, name: '龙' },
    //{ id: 6, name: '蛇' }, //NO ICON
    //{ id: 7, name: '马' }, // NO ICON
    //{ id: 8, name: '羊' }, // NO ICON
    { id: 9, name: '猴' }, 
    //{ id: 10, name: '鸡' }, //NO ICON
    //{ id: 11, name: '狗' }, //NO ICON
    //{ id: 12, name: '猪' },
    { id: 21, name: '水瓶座' },
    { id: 22, name: '双鱼座' },
    { id: 23, name: '白羊座' },
    { id: 24, name: '金牛座' },
    { id: 25, name: '双子座' },
    { id: 26, name: '巨蟹座' },
    { id: 27, name: '狮子座' },
    { id: 28, name: '处女座' },
    { id: 29, name: '天秤座' },
    //{ id: 31, name: '太阳' },
    //{ id: 32, name: '水星' },
    //{ id: 33, name: '金星' },
    //{ id: 34, name: '地球' },
    //{ id: 35, name: '火星' },
    //{ id: 36, name: '木星' },
    //{ id: 37, name: '土星' },
    //{ id: 38, name: '天王星' },
    //{ id: 38, name: '海王星' },
    //{ id: 38, name: '冥王星' },
    { id: 41, name: '斜眼' },
    { id: 42, name: '捂脸' },
    { id: 43, name: '哦哟' },
    { id: 44, name: '微笑' },
    { id: 45, name: '嗯哼' },
];

let teamArr:number[] = [];
let teamMap:{[key:number]:{id:number,name:string}} = {};
for(let i = 0; i < TEAM_ID_TABLE.length; ++i){
    let team = TEAM_ID_TABLE[i];
    teamMap[team.id] = team;
    teamArr.push(team.id);
}

export const TEAM_ID_ARR = teamArr;
export const TEAM_ID_MAP = teamMap;