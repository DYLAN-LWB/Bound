var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GameSpeedMotion = (function (_super) {
    __extends(GameSpeedMotion, _super);
    function GameSpeedMotion(stageW) {
        var _this = _super.call(this) || this;
        _this.count = 5;
        _this.index = 0;
        _this._person = new Bitmap("beibei_png"); //弹跳对象
        _this._stageW = stageW;
        _this._person.width = 110;
        _this._person.height = 110;
        _this._person.x = 145;
        _this._person.y = 350;
        _this.addChildAt(_this._person, 99);
        //person动画
        egret.Tween.get(_this._person).to({ x: _this._stageW - 150, y: 250 }, 1300).call(function () {
            egret.Tween.get(this._person).to({ x: 145, y: 350 }, 200);
        }, _this);
        var timer = new egret.Timer(300, _this.count);
        timer.addEventListener(egret.TimerEvent.TIMER, _this.timerFunc, _this);
        timer.start();
        //火箭的声音
        var sound = new egret.Sound();
        sound.addEventListener(egret.Event.COMPLETE, function () {
            this._channel = sound.play(0, 0);
        }, _this);
        sound.load("resource/sound/rocket.mp3");
        return _this;
    }
    GameSpeedMotion.prototype.timerFunc = function (event) {
        this.index += 1;
        if (this.speedImage && this.speedImage.parent) {
            this.speedImage.parent.removeChild(this.speedImage);
        }
        ;
        this.speedImage = new Bitmap("speed1_png");
        this.speedImage.width = this._stageW;
        this.addChild(this.speedImage);
        this.swapChildren(this.speedImage, this._person);
        var timer1 = new egret.Timer(100, 1);
        timer1.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.timerComFunc1, this);
        timer1.start();
    };
    GameSpeedMotion.prototype.timerComFunc1 = function (event) {
        if (this.speedImage && this.speedImage.parent) {
            this.speedImage.parent.removeChild(this.speedImage);
        }
        ;
        this.speedImage = new Bitmap("speed2_png");
        this.speedImage.width = this._stageW;
        this.addChild(this.speedImage);
        this.swapChildren(this.speedImage, this._person);
        var timer2 = new egret.Timer(100, 1);
        timer2.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.timerComFunc2, this);
        timer2.start();
    };
    GameSpeedMotion.prototype.timerComFunc2 = function (event) {
        if (this.speedImage && this.speedImage.parent) {
            this.speedImage.parent.removeChild(this.speedImage);
        }
        ;
        this.speedImage = new Bitmap("speed3_png");
        this.speedImage.width = this._stageW;
        this.addChild(this.speedImage);
        this.swapChildren(this.speedImage, this._person);
        if (this.index == this.count) {
            if (this.speedImage && this.speedImage.parent) {
                this.speedImage.parent.removeChild(this.speedImage);
            }
            ;
            if (this._person && this._person.parent) {
                this._person.parent.removeChild(this._person);
            }
            ;
            this._channel.stop();
        }
    };
    return GameSpeedMotion;
}(egret.Sprite));
__reflect(GameSpeedMotion.prototype, "GameSpeedMotion");
//# sourceMappingURL=GameSpeedMotion.js.map