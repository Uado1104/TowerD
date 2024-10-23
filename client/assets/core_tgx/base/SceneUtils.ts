import { assetManager, director, AssetManager } from "cc";
export class ISceneInfo {
    name: string;
    bundle?: string;
}

export class SceneUtil {
    static async loadBundleSync(bundleName: string) {
        return new Promise((resolve, reject) => {
            assetManager.loadBundle(bundleName, (err, bundle: AssetManager.Bundle) => {
                resolve(!err);
            });
        });
    }

    static async unloadBundle(bundleName:string) {
        if (!bundleName) {
            return;
        }
        let bundle = assetManager.getBundle(bundleName);
        if (bundle) {
            bundle.releaseAll();
            assetManager.removeBundle(bundle);
        }
    }

    static async reloadScene(){
        return new Promise((resolve, reject) => {
            director.loadScene(director.getScene().name,()=>{
                resolve(true);
            });
        });
    }

    static async loadScene(scene: ISceneInfo) {
        return new Promise((resolve, reject) => {
            let bundle = assetManager.getBundle(scene.bundle);
            if (bundle) {
                director.loadScene(scene.name, () => {
                    resolve(true);
                });
            }
            else {
                assetManager.loadBundle(scene.bundle, (err, bundle: AssetManager.Bundle) => {
                    if (bundle) {
                        director.loadScene(scene.name, () => {
                            resolve(true);
                        });
                    }
                })
            }
        });
    }
}