var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SpeedMotion = (function (_super) {
    __extends(SpeedMotion, _super);
    function SpeedMotion() {
        var _this = _super.call(this) || this;
        _this.count = 10;
        _this.index = 0;
        var timer = new egret.Timer(300, _this.count);
        timer.addEventListener(egret.TimerEvent.TIMER, _this.timerFunc, _this);
        timer.start();
        return _this;
    }
    SpeedMotion.prototype.timerFunc = function (event) {
        console.log("timerFunc");
        this.index += 1;
        if (this.speedImage && this.speedImage.parent) {
            this.speedImage.parent.removeChild(this.speedImage);
        }
        ;
        this.speedImage = this.createBitmapByName("1_png");
        this.speedImage.width = this.stage.stageWidth;
        this.addChild(this.speedImage);
        var timer1 = new egret.Timer(100, 1);
        timer1.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.timerComFunc1, this);
        timer1.start();
    };
    SpeedMotion.prototype.timerComFunc1 = function (event) {
        console.log("timerComFunc1");
        if (this.speedImage && this.speedImage.parent) {
            this.speedImage.parent.removeChild(this.speedImage);
        }
        ;
        this.speedImage = this.createBitmapByName("2_png");
        this.speedImage.width = this.stage.stageWidth;
        this.addChild(this.speedImage);
        var timer2 = new egret.Timer(100, 1);
        timer2.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.timerComFunc2, this);
        timer2.start();
    };
    SpeedMotion.prototype.timerComFunc2 = function (event) {
        console.log("timerComFunc2" + this.index + this.count);
        if (this.speedImage && this.speedImage.parent) {
            this.speedImage.parent.removeChild(this.speedImage);
        }
        ;
        this.speedImage = this.createBitmapByName("3_png");
        this.speedImage.width = this.stage.stageWidth;
        this.addChild(this.speedImage);
        if (this.index == this.count) {
            if (this.speedImage && this.speedImage.parent) {
                this.speedImage.parent.removeChild(this.speedImage);
            }
            ;
        }
    };
    SpeedMotion.prototype.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    return SpeedMotion;
}(egret.Sprite));
__reflect(SpeedMotion.prototype, "SpeedMotion");
//# sourceMappingURL=GameSpeedMotion.js.map