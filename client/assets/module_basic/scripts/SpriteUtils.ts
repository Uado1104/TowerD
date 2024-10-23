import { Sprite, assetManager, AssetManager, SpriteFrame, isValid } from "cc";
import { ModuleDef } from "../../scripts/ModuleDef";

export class SpriteUtils {

    public static setTeamSkin(sprite: Sprite, teamId: number) {
        assetManager.loadBundle(ModuleDef.ICONS, (err, bundle: AssetManager.Bundle) => {
            if (bundle) {
                let url = `team_skins/${teamId}/spriteFrame`;
                bundle.load(url, (err, spriteFrame: SpriteFrame) => {
                    if (!isValid(sprite)) {
                        return;
                    }
                    if (spriteFrame) {
                        sprite.spriteFrame = spriteFrame;
                    }
                    else {
                        console.log(err);
                    }
                });
            }
        });
    }

    public static setUserIcon(sprIcon: Sprite, visualId: number, bundleName: string = ModuleDef.BASIC) {
        bundleName = bundleName || ModuleDef.BASIC;
        let bundle = assetManager.getBundle(bundleName);
        if (!bundle) {
            console.log(`bundle ${bundleName} not found when call Utils.setUserIcon`);
            return;
        }
        bundle.load(`icons/icon${visualId}/spriteFrame`, (err, spriteFrame: SpriteFrame) => {
            if (!isValid(sprIcon)) {
                return;
            }
            if (err) {
                console.log(err);
            }
            sprIcon.spriteFrame = spriteFrame;
        });
    }
}

