import { _decorator, assetManager, AudioClip, Component, Node, Vec3 } from 'cc';
import { ModuleDef } from '../../scripts/ModuleDef';

const BundleName = ModuleDef.GAME;

export class GameAudioMgr {
    /**
  * @en
  * play short audio, such as strikes,explosions
  * @zh
  * 播放短音频,比如 打击音效，爆炸音效等
  * @param sound clip or url for the audio
  * @param volume 
  */
    public static playOneShot(sound: AudioClip | string, volume: number = 1.0) {
        tgx.AudioMgr.inst.playOneShot(sound, volume, BundleName);
    }

    /**
     * @en
     * play long audio, such as the bg music
     * @zh
     * 播放长音频，比如 背景音乐
     * @param sound clip or url for the sound
     * @param volume 
     */
    public static play(sound: AudioClip | string, volume: number = 1.0,) {
        tgx.AudioMgr.inst.play(sound, volume, BundleName);
    }

    /**
 * stop the audio play
 */
    public static stop() {
        tgx.AudioMgr.inst.stop();
    }

    /**
     * pause the audio play
     */
    public static pause() {
        tgx.AudioMgr.inst.pause();
    }

    /**
     * resume the audio play
     */
    public static resume() {
        tgx.AudioMgr.inst.audioSource.play();
    }

    public static getVolumeByDist(soundPos: { x: number, y: number, z: number }, earPos: { x: number, y: number, z: number }, maxDist: number = 50.0) {
        let dx = soundPos.x - earPos.x;
        let dy = soundPos.y - earPos.y;
        let dz = 0;
        let dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if(dist < 1.0){
            return 1.0;
        }
        let factor = 1.0 / (dist / maxDist);
        if (factor > 1.0) {
            factor = 1.0;
        }
        return factor
    }
}

