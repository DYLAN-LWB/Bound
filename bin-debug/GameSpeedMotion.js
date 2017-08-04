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
        _this.count = 15;
        _this.index = 0;
        _this._person = new Bitmap("beibei_png"); //弹跳对象
        _this._stageW = stageW;
        //火箭的声音
        var sound = new egret.Sound();
        sound.addEventListener(egret.Event.COMPLETE, function () {
            this._channel = sound.play(0, 0);
        }, _this);
        sound.load("resource/sound/rocket.mp3");
        _this._place = new Bitmap("speed1_png");
        _this._place.width = _this._stageW;
        _this.addChild(_this._place);
        _this.speedImage = new Bitmap("speed1_png");
        _this.speedImage.width = _this._stageW;
        _this.addChild(_this.speedImage);
        _this._person.width = 110;
        _this._person.height = 110;
        _this._person.x = 145;
        _this._person.y = 350;
        _this.addChildAt(_this._person, 99);
        //person动画
        egret.Tween.get(_this._person).to({ x: _this._stageW - 150, y: 350 }, 1500);
        var timer = new egret.Timer(100, _this.count);
        timer.addEventListener(egret.TimerEvent.TIMER, _this.timerFunc, _this);
        timer.start();
        return _this;
    }
    GameSpeedMotion.prototype.timerFunc = function (event) {
        this.index += 1;
        var timer1 = new egret.Timer(50, 1);
        timer1.addEventListener(egret.TimerEvent.TIMER_COMPLETE, function () {
            this.speedImage.texture = RES.getRes("speed2_png");
            var timer2 = new egret.Timer(50, 1);
            timer2.addEventListener(egret.TimerEvent.TIMER_COMPLETE, function () {
                this.speedImage.texture = RES.getRes("speed3_png");
                if (this.index == this.count) {
                    if (this.speedImage && this.speedImage.parent) {
                        this.speedImage.parent.removeChild(this.speedImage);
                    }
                    ;
                    if (this._person && this._person.parent) {
                        this._person.parent.removeChild(this._person);
                    }
                    ;
                    if (this._place && this._place.parent) {
                        this._place.parent.removeChild(this._place);
                    }
                    ;
                    this._channel.stop();
                }
            }, this);
            timer2.start();
        }, this);
        timer1.start();
    };
    return GameSpeedMotion;
}(egret.Sprite));
__reflect(GameSpeedMotion.prototype, "GameSpeedMotion");
//# sourceMappingURL=GameSpeedMotion.js.map