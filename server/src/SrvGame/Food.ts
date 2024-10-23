import { IFood } from "../shared/protocols/public/game/GameTypeDef";

export class Food implements IFood {
    id: number = 0;
    x: number = 0;
    y: number = 0;
    type: number = 0;
    radius: number = 0;
    weight: number = 0;
    color: number = 0;
    gridsIndex:number[] = [];
}