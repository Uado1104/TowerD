import { _decorator, AssetManager, assetManager, color, Color, Component, instantiate, Label, Node, Prefab, RichText, Sprite, SpriteFrame, tween, v3, Vec2, Vec3, Widget } from 'cc';
import { GameAudioMgr } from './GameAudioMgr';
import { PlayerMovement2D } from './PlayerMovement2D';
import { IGamePlayer } from '../../module_basic/shared/protocols/public/game/GameTypeDef';
import { CellBullet } from './CellBullet';
import { GameMgr } from '../../module_basic/scripts/GameMgr';
import { CellMgr } from './CellMgr';
import { UserMgr } from '../../module_basic/scripts/UserMgr';
import { TEAM_ID_MAP } from '../../module_basic/shared/types/TeamInfo';
import { ModuleDef } from '../../scripts/ModuleDef';
import { RoomMgr } from '../../module_basic/scripts/RoomMgr';
import { GameResMgr } from './GameResMgr';
import { GenderIcon } from '../../module_basic/scripts/GenderIcon';
import { ExtraNode, NodeUtils } from '../../module_basic/scripts/NodeUtils';
import { SpriteUtils } from '../../module_basic/scripts/SpriteUtils';
const { ccclass, property } = _decorator;

const tempV2 = new Vec2();

const tempV3 = new Vec3();

const tempColor = new Color();

@ccclass('Cell')
export class Cell extends Component {

    @property(Node) visualRoot: Node;
    @property(Node) body: Node;

    @property(Node) firePoint: Node;

    @property(Node) dir: Node;

    @property(Sprite) sprIcon: Sprite;

    @property(Sprite) sprEfx: Sprite;

    @property(Label) lblName: Label;

    @property(Label) lblTeam: Label;

    @property(Label) lblLocation: Label;

    @property(GenderIcon) genderIcon: GenderIcon;

    public player: IGamePlayer;
    public movement: PlayerMovement2D;

    private _transformsCache: number[][] = []

    start() {
        this.movement = this.node.getComponent(PlayerMovement2D);
        CellMgr.inst.addCell(this);
    }

    setPlayer(player: IGamePlayer) {
        this.player = player;
        this.dir.active = player.uid == UserMgr.inst.uid;;
        this.setRadius(player.radius);

        this.lblName.string = player.roleName;

        let teamName = TEAM_ID_MAP[player.teamId].name;

        this.lblTeam.string = `[${teamName}]`;

        if (GameMgr.inst.selfPlayer.teamId == player.teamId) {
            tempColor.fromHEX('#00EF00');
            this.lblTeam.color = tempColor;
            tempColor.fromHEX('#000000');
            this.lblTeam.outlineColor = tempColor;
        }
        else {
            tempColor.fromHEX('#FF0000');
            this.lblTeam.color = tempColor;
            tempColor.fromHEX('#FFFFFF');
            this.lblTeam.outlineColor = tempColor;
        }

        this.setColor(player.color);
        this.setState('normal');
        this.lblLocation.string = player.location || '保密';
        this.lblLocation.updateRenderData(true);
        this.genderIcon.setGender(RoomMgr.inst.getUser(player.uid)?.gender);
        this.lblLocation.node.children.forEach(v => {
            v.getComponent(Widget).updateAlignment();
        });

        SpriteUtils.setTeamSkin(this.sprIcon, player.teamId);
        this.setColor(0xFFFFFFFF);
    }

    setState(state: 'normal' | 'destroyed') {
        if (state == 'normal') {
            this.visualRoot.active = true;
        }
        else if (state == 'destroyed') {
            this.visualRoot.active = false;
        }
    }

    setRadius(radius: number) {
        let scale = radius * 2 / 150;
        this.body.setScale(scale, scale, 1.0);
        (this.node as ExtraNode).__radius__ = radius;
        this.lblLocation.node.active = radius > 75;
    }

    setColor(colorVal: number) {
        Color.fromUint32(tempColor, colorVal | 0xff000000);
        this.sprIcon.color = tempColor;
    }

    protected onDestroy(): void {
        CellMgr.inst.removeCell(this);
    }

    shootAnim(cb?: Function) {
        let t = GameMgr.inst.selfPlayer.transform;
        tempV3.set(t[0], t[1], t[2]);
        let volume = GameAudioMgr.getVolumeByDist(this.node.worldPosition, tempV3);
        GameAudioMgr.playOneShot('sounds/sfx_shoot', volume);

        //animation
    }

    fireBullet(pos: { x: number, y: number, z: number }, rotationDegrees: number) {
        let bullet = instantiate(GameResMgr.inst.bulletPrefab);
        this.node.parent.addChild(bullet);
        bullet.setWorldPosition(pos.x, pos.y, pos.z);
        bullet.setRotationFromEuler(0, 0, rotationDegrees);

        let rotationAngle = rotationDegrees / 180 * Math.PI;
        let dir = tempV2.set(Math.cos(rotationAngle), Math.sin(rotationAngle));
        bullet.getComponent(CellBullet).moveDir = dir;
        return bullet;
    }

    private computeTargetDist(x1: number, y1: number, x2: number, y2: number) {
        let dx = x1 - x2;;
        let dy = y1 - y2;
        let dist = Math.sqrt(dx * dx + dy * dy);
        return dist;
    }
    syncTransform(trans: number[], forceSync: boolean) {
        if (forceSync) {
            this._transformsCache = [];
            this.node.setWorldPosition(trans[0], trans[1], trans[2]);
            if(this.movement){
                this.movement.onMovement(trans[3],1.0);
            }
        }
        else {
            this._transformsCache.push(trans);
            let dist = 0;
            let pos = this.node.worldPosition;
            let lastX = pos.x;
            let lastY = pos.y;
            this._transformsCache.forEach(v => {
                dist += this.computeTargetDist(lastX, lastY, v[0], v[1]);
                lastX = v[0];
                lastY = v[1];
            });
            //distance is too far
            if (dist >= this.player.speed) {
                this._transformsCache = [];
                this.node.setWorldPosition(trans[0], trans[1], trans[2]);
                console.log('distance is too far,force sync transform');
            }
        }
    }

    protected update(dt: number): void {
        if (this.player.protectedTime > 0) {
            this.sprEfx.node.active = true;
            tempColor.set(this.sprEfx.color);
            //clamp to 0.2 ~ 0.8
            tempColor.a = 255 * (Math.sin(Date.now() / 50 / Math.PI) * 0.6 + 0.2);
            this.sprEfx.color = tempColor;
        }
        else {
            this.sprEfx.node.active = false;
        }
    }


    private _lastRotation = NaN;
    private _lastSyncTime = 0;
    protected lateUpdate(dt: number): void {
        if (GameMgr.inst.gameData && GameMgr.inst.gameData.gameState != 'playing') {
            return;
        }

        if (this.player.playerId == GameMgr.inst.selfPlayer.playerId) {
            this.lateUpdate_SelfPlayer(dt);
        }
        else {
            this.lateUpdate_OtherPlayers(dt);
        }
    }

    lateUpdate_SelfPlayer(dt: number) {
        if (this.movement?.getRealSpeed() > 0) {
            let pos = this.node.worldPosition;
            this.dir.setWorldRotationFromEuler(0, 0, this.movement.realDegree);
            let rotation = this.movement.rotDegree;
            if (rotation != this._lastRotation || Date.now() - this._lastSyncTime > 2000) {
                this._lastRotation = rotation;
                this._lastSyncTime = Date.now();
                //console.log(rotation);
                GameMgr.inst.sendMsg_CellDataChange(pos.x, pos.y, pos.z, rotation);
            }
        }
    }

    lateUpdate_OtherPlayers(dt: number) {
        if (this.player.state != 'moving') {
            return;
        }

        if (this._transformsCache.length == 0) {
            let rotation = this.player.transform[3] / 180 * Math.PI;
            let dirX = Math.cos(rotation);
            let dirY = Math.sin(rotation);
            let len = Math.sqrt(dirX * dirX + dirY * dirY);
            if (len > 0) {
                dirX /= len;
                dirY /= len;
            }

            let pos = this.node.worldPosition;
            let targetX = pos.x + dirX * this.player.speed * dt;
            let targetY = pos.y + dirY * this.player.speed * dt;
            this.node.setWorldPosition(targetX, targetY, pos.z);
        }
        else {
            //加速处理
            let speed = this._transformsCache.length * this.player.speed;
            let movement = speed * dt;
            while (movement > 0 && this._transformsCache.length > 0) {
                let pos = this.node.worldPosition;
                let target = this._transformsCache[0];
                let dist = this.computeTargetDist(pos.x, pos.y, target[0], target[1]);
                if (dist > movement) {
                    let factor = movement / dist;
                    let targetX = pos.x * (1 - factor) + target[0] * (factor);
                    let targetY = pos.y * (1 - factor) + target[1] * (factor);
                    this.node.setWorldPosition(targetX, targetY, pos.z);
                    movement = 0;
                }
                else {
                    movement -= dist;
                    this.node.setWorldPosition(target[0], target[1], pos.z);
                    this._transformsCache.shift();
                }
            }
        }
        NodeUtils.clampInMapBoundary(this.node as ExtraNode);
    }
}

