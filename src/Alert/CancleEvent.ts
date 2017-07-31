class CancleEvent extends egret.Event {
    public static DATE:string = "CancleEvent";

    public constructor(type:string, bubbles:boolean = false, cancelable:boolean = false) {
        super(type, bubbles, cancelable);
    }
}