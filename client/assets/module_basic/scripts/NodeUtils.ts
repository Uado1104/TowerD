
import { Vec3,Node } from "cc";
import { GameMgr } from "../../module_basic/scripts/GameMgr";
const tempV3 = new Vec3();
export type ExtraNode = Node & {
    __radius__: number;
}

export class NodeUtils{
    public static clampInMapBoundary(node: ExtraNode) {
        if(!node || !GameMgr.inst.gameData){
            return;
        }
        let radius = node.__radius__;
        node.getWorldPosition(tempV3);
        const halfWidth = GameMgr.inst.gameData.mapWidth / 2 - radius;
        const halfHeight = GameMgr.inst.gameData.mapHeight / 2 - radius;

        node.getWorldPosition(tempV3);
        if (tempV3.x < -halfWidth) {
            tempV3.x = -halfWidth;
        }
        if (tempV3.x > halfWidth) {
            tempV3.x = halfWidth;
        }
        if (tempV3.y < -halfHeight) {
            tempV3.y = -halfHeight;
        }
        if (tempV3.y > halfHeight) {
            tempV3.y = halfHeight;
        }
        node.setWorldPosition(tempV3);
    }
}