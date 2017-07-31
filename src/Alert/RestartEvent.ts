/**
 * Created by Administrator on 2017/7/13 0013.
 */
class RestartEvent extends egret.Event {
    public static DATE:string = "RestartEvent";

    public constructor(type:string, bubbles:boolean = false, cancelable:boolean = false) {
        super(type, bubbles, cancelable);
    }
}