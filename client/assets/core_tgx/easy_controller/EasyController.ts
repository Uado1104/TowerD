import { EventHandler, _decorator, director } from 'cc';

export class EasyControllerEvent{
    /**
    * Dispatched when camera rotating
    * @params rx: horizontal rotation
    * @params ry: vertical rotation.
    */
    public static CAMERA_ROTATE:string = 'EasyControllerEvent.CAMERA_ROTATE';
    
    /**
     * Dispatched when camera zooming
     * @params delta: amount of camera zoom
    */
    public static CAMERA_ZOOM:string = 'EasyControllerEvent.CAMERA_ZOOM';
    /**
     * Dispatched when the movement controller is moving
     * @param degree: direction in degrees, with positive X-axis as 0, increasing in a counter-clockwise direction.
     * @param strength: movement strength, [0.0, 1.0], can be used for fine-tuning the movement speed.
     */
    public static MOVEMENT:string = 'EasyControllerEvent.MOVEMENT';
    /**
     * Dispatched when the movement controller stops moving
     */
    public static MOVEMENT_STOP:string = 'EasyControllerEvent.MOVEMENT_STOP';
    
    /**
     * Dispatched when one of the buttons is pressed.
     * @param buttonName: string, indicates which button is pressed. 
     */
    public static BUTTON:string = 'EasyControllerEvent.BUTTON';

    /**
     * Dispatched when screen is touched.
     */
    public static SCREEN_TOUCH_START:string = 'EasyControllerEvent.SCREEN_TOUCH_START';

    /**
     * Dispatched when screen is touched end.
     */
    public static SCREEN_TOUCH_END:string = 'EasyControllerEvent.SCREEN_TOUCH_END';
}

export class EasyController{

    public static on(type:string,callback:any,target?:any){
        director.on(type,callback,target);
    }

    public static off(type:string,callback?:any,target?:any){
        director.off(type,callback,target);
    }
}