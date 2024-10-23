import { _decorator, color, Component, director, instantiate, Label, Node, Prefab, size, screen, Sprite, SpriteFrame, UITransform, Material, renderer, Vec2, Vec4 } from 'cc';
import { GameEvent, GameMgr } from '../../module_basic/scripts/GameMgr';
import { UserMgr } from '../../module_basic/scripts/UserMgr';
import { GameCamera } from './GameCamera';
import { PlayerController } from './PlayerController';
import { UIGameHUD } from '../ui_game_hud/UIGameHUD';
import { UIGameRevive } from '../ui_game_revive/UIGameRevive';
import { PlayerMovement2D } from './PlayerMovement2D';
import { Cell } from './Cell';
import { UIGameMask } from '../ui_game_mask/UIGameMask';
import { UIGameJoystick } from '../ui_game_joystick/UIGameJoystick';
import { UIGameRank } from '../ui_game_rank/UIGameRank';
import { MsgFoodAddedPush } from '../../module_basic/shared/protocols/public/game/MsgFoodAddedPush';
import { IFood, IGamePlayer } from '../../module_basic/shared/protocols/public/game/GameTypeDef';
import { MsgCellDataChange } from '../../module_basic/shared/protocols/public/game/MsgCellDataChange';
import { MsgFoodEatenPush } from '../../module_basic/shared/protocols/public/game/MsgFoodEatenPush';
import { MsgPlayerDataChangedPush } from '../../module_basic/shared/protocols/public/game/MsgPlayerDataChangedPush';
import { RoomMgr } from '../../module_basic/scripts/RoomMgr';
import { UIGameTimeCounter } from '../ui_game_time_counter/UIGameTimeCounter';
import { MsgGameDataChangedPush } from '../../module_basic/shared/protocols/public/game/MsgGameDataChangedPush';
import { MsgGameOverPush } from '../../module_basic/shared/protocols/public/game/MsgGameOverPush';
import { UIGameMatching } from '../../module_basic/ui_game_matching/UIGameMatching';
import { UIGameWinner } from '../../module_basic/ui_game_winner/UIGameWinner';
import { GameResMgr } from './GameResMgr';
import { ExtraNode } from '../../module_basic/scripts/NodeUtils';
const { ccclass, property } = _decorator;

const tmpColor = color();

@ccclass('GameScene')
export class GameScene extends Component {
    @property(Node) mapRoot: Node;
    @property(Node) background:Node;
    @property(Node) objectsRoot: Node;
    @property(GameCamera) gameCamera: GameCamera;
    @property(Material) mapMaterial:Material;

    private _cellMap: { [key: number]: Cell } = {};
    private _foodMap: { [key: number]: Node } = {};
    private _foodPool: Node[] = [];

    private _backgroundPass:renderer.Pass;
    private _handleEdgeFactor:number;
    
    async start() {

        this.initBackground();
        
        if(RoomMgr.inst.selfUser && !RoomMgr.inst.selfUser.ready){
            RoomMgr.inst.rpc_Ready();
        }

        tgx.UIMgr.inst.closeAll();

        if (!RoomMgr.inst.isPlaying && !UIGameMatching.isShowing) {
            tgx.UIMgr.inst.showUI(UIGameMatching);
        }
        else if (GameMgr.inst.gameData.gameState == 'counting' && GameMgr.inst.gameData.gameStateRemainingTime > 0) {
            tgx.UIMgr.inst.showUI(UIGameTimeCounter, null, null, { endTime: GameMgr.inst.gameStateEndTime });
        }

        //tgx.UIMgr.inst.showUI(UIGameMask);
        tgx.UIMgr.inst.showUI(UIGameJoystick);
        tgx.UIMgr.inst.showUI(UIGameHUD);
        tgx.UIMgr.inst.showUI(UIGameRank);

        director.on(GameEvent.PLAYER_COMES, this.onPlayerComes, this);
        director.on(GameEvent.PLAYER_LEAVES, this.onPlayerLeaves, this);
        director.on(GameEvent.PLAYER_DATA_CHANGED, this.onPlayerDataChanged, this);

        director.on(GameEvent.CELL_DATA_CHANGED, this.onCellDataChanged, this);
        director.on(GameEvent.FOOD_EATEN, this.onFoodEaten, this);
        director.on(GameEvent.FOOD_ADDED, this.onFoodAdded, this);

        director.on(GameEvent.PLAYER_REVIVE, this.onPlayerRevive, this);
        director.on(GameEvent.PLAYER_DIE, this.onPlayerDie, this);

        director.on(GameEvent.GAME_DATA_CHANGED, this.onGameDataChanged, this);
        director.on(GameEvent.GAME_OVER, this.onGameOver, this);

        GameMgr.inst.gameData.players.forEach(player => {
            this.createCell(player);
        });

        let keys = Object.keys(GameMgr.inst.gameData.foodList);
        keys.forEach(foodId => {
            this.createFood(GameMgr.inst.gameData.foodList[foodId]);
        });
    }

    protected onDestroy(): void {
        director.off(GameEvent.PLAYER_COMES, this.onPlayerComes, this);
        director.off(GameEvent.PLAYER_LEAVES, this.onPlayerLeaves, this);
        director.off(GameEvent.PLAYER_DATA_CHANGED, this.onPlayerDataChanged, this);

        director.off(GameEvent.CELL_DATA_CHANGED, this.onCellDataChanged, this);
        director.off(GameEvent.FOOD_EATEN, this.onFoodEaten, this);
        director.off(GameEvent.FOOD_ADDED, this.onFoodAdded, this);

        director.off(GameEvent.PLAYER_REVIVE, this.onPlayerRevive, this);
        director.off(GameEvent.PLAYER_DIE, this.onPlayerDie, this);

        director.off(GameEvent.GAME_DATA_CHANGED, this.onGameDataChanged, this);
        director.off(GameEvent.GAME_OVER, this.onGameOver, this);

    }

    initBackground(){
        const extBorder = 4000;
        const realWidth = GameMgr.inst.gameData.mapWidth+extBorder;
        const realHeight = GameMgr.inst.gameData.mapHeight+extBorder;
        this.background.getComponent(UITransform).contentSize = size(realWidth,realHeight);
        
        //@en initialize the material parameters of the background.
        //@zh 初始化地图背景材质
        const halfWidth = GameMgr.inst.gameData.mapWidth/2;
        const halfHeight = GameMgr.inst.gameData.mapHeight/2;
        let spriteFrame = this.background.getComponent(Sprite).spriteFrame;
        let uvScale = new Vec2();
        let scaler = 0.6;
        //@en use uv scale to adapt the map size
        //@zh 使用uv缩放来适配地图大小
        uvScale.x = realWidth/spriteFrame.width * scaler;
        uvScale.y = realHeight/spriteFrame.height * scaler;
        this.mapMaterial.setProperty('uvScale', uvScale);
        this.mapMaterial.setProperty('halfMapSize', new Vec2(halfWidth,halfHeight));
        //this.mapMaterial.setProperty('edgeColor', new Vec4(1.0,0.0,0.0,1.0));
        //this.mapMaterial.setProperty('fadeOutRange', 1000.0);

        //@en save the material parameter handle for efficient setting of material parameters in update
        //@zh 保存材质参数相关句柄，方便在update中高效率地设置材质参数
        this._backgroundPass = this.mapMaterial.passes[0];
        this._handleEdgeFactor = this._backgroundPass.getHandle('edgeFactor');
    }

    onPlayerComes(player: IGamePlayer) {
        this.createCell(player);
    }

    onPlayerLeaves(player: IGamePlayer) {
        let cell = this._cellMap[player.playerId];
        if (!cell) {
            return;
        }
        cell.node.removeFromParent();
        cell.node.destroy();
        delete this._cellMap[player.playerId];
    }

    onPlayerDataChanged(msg: MsgPlayerDataChangedPush) {

    }

    onCellDataChanged(msg: MsgCellDataChange) {

        let cell = this._cellMap[msg.playerId];
        if (!cell) {
            return
        }
        if (msg.transform != undefined) {
            if (msg.playerId != GameMgr.inst.selfPlayer.playerId || msg.forceSync) {
                cell.syncTransform(msg.transform, msg.forceSync);
            }
        }

        if (msg.radius != undefined) {
            cell.setRadius(msg.radius);
        }

        if (cell.movement && msg.speed != undefined) {
            cell.movement.moveSpeed = msg.speed;
        }
    }

    onFoodEaten(msg: MsgFoodEatenPush) {
        for (let i = 0; i < msg.eatenFoods.length; i++) {
            let foodId = msg.eatenFoods[i];
            let foodNode = this._foodMap[foodId];
            delete this._foodMap[foodId];
            foodNode.removeFromParent();
            this._foodPool.push(foodNode);
        }
    }

    onFoodAdded(msg: MsgFoodAddedPush) {
        msg.foods.forEach(food => {
            this.createFood(food);
        });
    }

    onPlayerRevive(player: IGamePlayer) {
        let cell = this._cellMap[player.playerId];
        if (!cell) {
            return;
        }
        cell.setState('normal');
        cell.movement?.tempSpeedUp(1, 1);
    }

    onPlayerDie(player: IGamePlayer) {
        let cell = this._cellMap[player.playerId];
        if (!cell) {
            return;
        }
        cell.setState('destroyed');
        cell.movement?.tempSpeedUp(0, Number.MAX_VALUE);

        if (player.playerId == GameMgr.inst.selfPlayer.playerId) {
            tgx.UIMgr.inst.showUI(UIGameRevive);
        }
    }

    onGameDataChanged(msg: MsgGameDataChangedPush) {
        if (msg.gameState == 'counting' && msg.gameStateRemainingTime > 0) {
            tgx.UIMgr.inst.showUI(UIGameTimeCounter, null, null, { endTime: GameMgr.inst.gameStateEndTime });
        }
    }

    onGameOver(msg: MsgGameOverPush) {
        tgx.UIMgr.inst.showUI(UIGameWinner,null,null,{
            gameOver:msg,
            gameData:GameMgr.inst.gameData,
            roomData:RoomMgr.inst.data,
        });
    }

    async createCell(player: IGamePlayer) {
        let newCell = instantiate(GameResMgr.inst.cellPrefab);
        this.objectsRoot.addChild(newCell);
        newCell.setWorldPosition(player.transform[0], player.transform[1], player.transform[2]);
        let cellComp = newCell.getComponent(Cell);
        cellComp.setPlayer(player);
        this._cellMap[player.playerId] = cellComp;

        if (player.uid == UserMgr.inst.uid) {
            let mv2d = newCell.addComponent(PlayerMovement2D);
            mv2d.needRotation = false;
            mv2d.moveSpeed = player.speed;
            mv2d.setPrecision(10);
            this.gameCamera.target = cellComp;
            newCell.addComponent(PlayerController);

            if(player.state == 'moving'){
                mv2d.onMovement(player.transform[3],1.0);
            }
        }
    }

    async createFood(fd: IFood) {
        let newFood = this._foodPool.pop();
        if (!newFood) {
            newFood = new Node();
            newFood.addComponent(Sprite);
        }

        this.mapRoot.addChild(newFood);
        newFood.name = 'food_' + fd.id;
        this._foodMap[fd.id] = newFood;

        let foodSprites = GameResMgr.inst.foodSprites;

        let sprf = foodSprites[fd.type % foodSprites.length];
        let spr = newFood.getComponent(Sprite);
        spr.spriteFrame = sprf;
        tmpColor.fromHEX(fd.color.toString(16));
        spr.color = tmpColor;

        let scale = fd.radius * 2 / sprf.rect.width;
        newFood.setScale(scale, scale, 1.0);
        newFood.setRotationFromEuler(0, 0, Math.random() * 360);
        newFood.setWorldPosition(fd.x, fd.y, 0);
    }

    private _hasShown = false;
    private _lastSortTime = 0;
    update(deltaTime: number) {
        
        let value = Math.sin(Date.now()/50/Math.PI);
        value = value * 0.5 + 0.5;
        this._backgroundPass.setUniform(this._handleEdgeFactor,value);

        if (!this._hasShown && GameMgr.inst.gameData && GameMgr.inst.gameData.gameState == 'playing') {
            if (GameMgr.inst.gameStateEndTime - Date.now() < 5000) {
                this._hasShown = true;
                tgx.UIMgr.inst.showUI(UIGameTimeCounter, null, null, { tips: '游戏即将结束', endTime: GameMgr.inst.gameStateEndTime });
            }
        }

        /*
        let winSize = screen.windowSize;
        let cameraPos = this.gameCamera.node.worldPosition;

        this.objectsRoot.children.forEach(v=>{
            const wpos = v.worldPosition;
            const radius = v['__radius__'];
            const leftSize = -winSize.width /2 - radius + cameraPos.x;
            const rightSide = winSize.width / 2 + radius + cameraPos.x;
            const topSide = winSize.height /2 + radius + cameraPos.y;
            const bottomSide = -winSize.height /2 - radius + cameraPos.y;
            v.children[0].children[0].active = wpos.x >= leftSize && wpos.x <= rightSide && wpos.y >= bottomSide && wpos.y <= topSide;
        });
        */

        //
        if(Date.now() - this._lastSortTime > 333){
            //let t  = Date.now();
            this.objectsRoot.children.sort((a:ExtraNode,b:ExtraNode)=>{
                return a.__radius__ - b.__radius__;
            });
            this._lastSortTime = Date.now();
            //console.log(Date.now() - t,this.objectsRoot.children.length);
        }
    }
}

