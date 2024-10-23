import { _decorator, Button, color, Color, Component, director, instantiate, Label, Node, tween } from 'cc';
const { ccclass, property } = _decorator;

import { GameUILayers } from "../../scripts/GameUILayers";
import { ModuleDef } from '../../scripts/ModuleDef';
import { RoomMgr } from '../../module_basic/scripts/RoomMgr';
import { MatchPlayer } from './MatchPlayer';
import { UserLocalCache } from '../scripts/UserLocalCache';
import { SceneDef } from '../../scripts/SceneDef';
import { GameEvent, GameMgr } from '../scripts/GameMgr';
import { NoticeLabel } from './NoticeLabel';
import { IGamePlayer } from '../shared/protocols/public/game/GameTypeDef';
import { TEAM_ID_MAP } from '../shared/types/TeamInfo';
import { UserMgr } from '../scripts/UserMgr';

@ccclass('UIGameMatching')
export class Layout_UIGameMatching extends Component {
    @property([MatchPlayer]) players: MatchPlayer[] = [];
    @property(Label) lblTeam: Label;
    @property(Label) lblTips: Label;
    @property(Node) noticeRoot: Node;
}

const tmpColor = color();

@tgx_class(ModuleDef.BASIC)
export class UIGameMatching extends tgx.UIController {
    get layout(): Layout_UIGameMatching {
        return this._layout as Layout_UIGameMatching;
    }

    public static isShowing = false;

    constructor() {
        super('ui_game_matching/ui_game_matching', GameUILayers.POPUP, Layout_UIGameMatching);
        this._ingoreCloseAll = true;

        UIGameMatching.isShowing = true;
    }

    private _teamMembers: IGamePlayer[] = [];
    private _startTime = Date.now();

    protected onCreated(args: any): void {

        this._noticeItemPrefab = this.layout.noticeRoot.children[0];
        this.layout.noticeRoot.removeAllChildren();
        this.layout.players[0].lblName.string = UserLocalCache.inst.getRoleName(UserMgr.inst.uid);

        director.on(GameEvent.PLAYER_COMES, this.onPlayerComes, this);
        let gameData = GameMgr.inst.gameData;
        if (gameData) {
            let selfPlayer = GameMgr.inst.selfPlayer;
            this._teamMembers.push(selfPlayer);
            gameData.players.forEach(player => {
                if (player.teamId == selfPlayer.teamId && player.playerId != selfPlayer.playerId) {
                    this._teamMembers.push(player);
                    console.log('player:', player.playerId, 'join team:', player.teamId, ',', this._teamMembers.length);
                }
            });

            if (gameData.gameState == 'waiting') {
                this.refreshTeamView();
            }
        }
    }

    protected onDispose(): void {
        director.off(GameEvent.PLAYER_COMES, this.onPlayerComes, this);
        UIGameMatching.isShowing = false;
    }

    protected onUpdate(dt: number): void {
        let elapsedTime = Math.floor((Date.now() - this._startTime) / 1000);
        if (elapsedTime < 60) {
            this.layout.lblTips.string = '等待其他玩家... ' + elapsedTime + 's';
        }
        else {
            let s = elapsedTime % 60;
            let m = Math.floor(elapsedTime / 60);
            this.layout.lblTips.string = '等待其他玩家... ' + m + 'm' + s + 's';
        }

        if (director.getScene().name == SceneDef.GAME.name && (!RoomMgr.inst.data || RoomMgr.inst.data.isPlaying)) {
            this.close();
        }
    }

    refreshTeamView() {
        let selfPlayer = GameMgr.inst.selfPlayer;
        this.layout.lblTeam.string = `队伍阵营：${TEAM_ID_MAP[selfPlayer.teamId].name}`;
        for (let i = 0; i < this._teamMembers.length; ++i) {
            let playerCom = this.layout.players[i];
            let p = this._teamMembers[i];
            playerCom.setPlayer(p);
        }
    }


    onPlayerComes(player: IGamePlayer) {
        let selfPlayer = GameMgr.inst.selfPlayer;
        let oldNum = this._teamMembers.length;
        if (this._teamMembers.length == 0) {
            this._teamMembers.push(selfPlayer);
        }
        if (player.teamId == selfPlayer.teamId && player.playerId != selfPlayer.playerId) {
            this._teamMembers.push(player);
            this.addNotice(player.roleName + ' 加入了队伍');
        }
        else {
            this.addNotice(player.roleName + ' 加入了游戏');
        }

        if (oldNum != this._teamMembers.length) {
            this.refreshTeamView();
        }
    }

    private _noticeItemPrefab: Node;
    private _noticeItemPool: NoticeLabel[] = [];
    getNoticeItemFromPool(): NoticeLabel {
        let item = this._noticeItemPool.pop();
        if (!item) {
            let node = instantiate(this._noticeItemPrefab);
            item = node.getComponent(NoticeLabel);
        }
        item.node.parent = this.layout.noticeRoot;
        return item;
    }

    putNoticeItemToPool(item: NoticeLabel) {
        item.node.removeFromParent();
        this._noticeItemPool.push(item);
    }

    addNotice(msg: string) {
        let notice = this.getNoticeItemFromPool();
        notice.string = msg;
        notice.alpha = 255;
        tween(notice).to(2.5, { alpha: 0 }).call(() => {
            this.putNoticeItemToPool(notice);
        }).start();
    }
}