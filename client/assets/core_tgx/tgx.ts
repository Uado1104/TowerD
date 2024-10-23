
//basic
import { ISceneInfo, SceneUtil } from "./base/SceneUtils";
import { AudioMgr } from "./base/AudioMgr";
import { InputMgr } from "./base/InputMgr";
import { ResourceMgr } from "./base/ResourceMgr";
import { SafeJSON } from "./base/SafeJSON";
import { ResolutionAutoFit } from "./base/ResolutionAutoFit";
import { ModuleContext } from "./base/ModuleContext";

//camera
import { FPSCamera } from "./easy_camera/FPSCamera";
import { FollowCamera2D } from "./easy_camera/FollowCamera2D";
import { FreeCamera } from "./easy_camera/FreeCamera";
import { ThirdPersonCamera } from "./easy_camera/ThirdPersonCamera";

//easy controller
import { CharacterMovement } from "./easy_controller/CharacterMovement";
import { CharacterMovement2D } from "./easy_controller/CharacterMovement2D";
import { EasyController, EasyControllerEvent } from "./easy_controller/EasyController";
import { ThirdPersonCameraCtrl } from "./easy_controller/ThirdPersonCameraCtrl";
import { UIJoystick } from "./easy_controller/UIJoystick";

//ui framework
import { UIAlert, Layout_UIAlert } from "./easy_ui_framework/alert/UIAlert";
import { Layout_UIWaiting } from "./easy_ui_framework/waiting/Layout_UIWaiting";
import { UIWaiting } from "./easy_ui_framework/waiting/UIWaiting";
import { EventDispatcher } from "./easy_ui_framework/EventDispatcher";
import { UIController } from "./easy_ui_framework/UIController";
import { UILayers, UILayerNames } from "./easy_ui_framework/UILayers";
import { UIMgr } from "./easy_ui_framework/UIMgr";
import { URLUtils } from "./base/URLUtils";

const __tgx__ = {
    //base
    ISceneInfo,
    SceneUtil,
    AudioMgr,
    InputMgr,
    ResourceMgr,
    SafeJSON,
    ResolutionAutoFit,
    ModuleContext,

    //camera
    FPSCamera,
    FollowCamera2D,
    FreeCamera,
    ThirdPersonCamera,
    //easy controller
    CharacterMovement,
    CharacterMovement2D,
    EasyController,
    EasyControllerEvent,
    ThirdPersonCameraCtrl,
    UIJoystick,
    //ui framework
    Layout_UIAlert,
    UIAlert,
    Layout_UIWaiting,
    UIWaiting,
    EventDispatcher,
    UIController,
    UILayers,
    UILayerNames,
    UIMgr,
    URLUtils,
};


(globalThis as any)['tgx'] = __tgx__;


//下面是声明，编程时提示。

declare global {
    namespace globalThis {
        namespace tgx {
            export {
                //base
                ISceneInfo,
                SceneUtil,
                AudioMgr,
                InputMgr,
                ResourceMgr,
                SafeJSON,
                ResolutionAutoFit,
                ModuleContext,

                //camera
                FPSCamera,
                FollowCamera2D,
                FreeCamera,
                ThirdPersonCamera,
                //easy controller
                CharacterMovement,
                CharacterMovement2D,
                EasyController,
                EasyControllerEvent,
                ThirdPersonCameraCtrl,
                UIJoystick,
                //ui framework
                Layout_UIAlert,
                UIAlert,
                Layout_UIWaiting,
                UIWaiting,
                EventDispatcher,
                UIController,
                UILayers,
                UILayerNames,
                UIMgr,
                URLUtils,
            }
        }
        /**
         * @en to ensure tgx_class is loaded before all other scripts, the implementation is placed in tgx_class.js and loaded as a plugin.
         * @zh tgx_class 需要确保在所有脚本加载之前加载，所以 tgx_class 真正的定义放在了 tgx_class.js 里，并使用插件方式加载。
        */
        const tgx_class: (module: string, superCls?: Function) => any;
    }
}