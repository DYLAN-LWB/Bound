/**
 * Created by Administrator on 2017/7/13 0013.
 */
class RankingEvent extends egret.Event {
    public static DATE:string = "RankingEvent";

    public constructor(type:string, bubbles:boolean = false, cancelable:boolean = false) {
        super(type, bubbles, cancelable);
    }
}