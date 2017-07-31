class AlertEvent extends egret.Event {
    public static DATE:string = "AlertEvent";

    public constructor(type:string, bubbles:boolean = false, cancelable:boolean = false) {
        super(type, bubbles, cancelable);
    }
}