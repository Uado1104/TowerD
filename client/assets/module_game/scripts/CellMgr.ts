import { Component,Node } from "cc";
import { IGamePlayer } from "../../module_basic/shared/protocols/public/game/GameTypeDef";

export type CellType = {
    node:Node,
    player:IGamePlayer,
} 

export class CellMgr {
    private static _inst: CellMgr;
    public static get inst(): CellMgr {
        if (!this._inst) {
            this._inst = new CellMgr();
        }
        return this._inst;
    }

    private _cellList: CellType[] = [];

    public addCell(cell: CellType) {
        this._cellList.push(cell);
    }

    public removeCell(cell: CellType) {
        this._cellList.splice(this._cellList.indexOf(cell), 1);
    }

    public get cellList(): CellType[] {
        return this._cellList;
    }
}