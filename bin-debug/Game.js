var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Game = (function (_super) {
    __extends(Game, _super);
    function Game() {
        var _this = _super.call(this) || this;
        _this.mainObject = _this.createBitmapByName("egret_icon_png");
        _this.objectBeginPoint = new egret.Point(0, 0); //出发点
        _this.objectWH = 50;
        _this.touchBeginPoint = new egret.Point(0, 0);
        _this.guideLine = new egret.Shape();
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    Game.prototype.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    Game.prototype.onAddToStage = function (event) {
        this.stageW = this.stage.stageWidth;
        this.stageH = this.stage.stageHeight;
        var stageBackground = this.createBitmapByName("testbg_png");
        stageBackground.x = 0;
        stageBackground.y = 0;
        stageBackground.width = this.stageW;
        stageBackground.height = this.stageH;
        this.addChild(stageBackground);
        this.mainObject.x = 100;
        this.mainObject.y = 200;
        this.mainObject.width = this.objectWH;
        this.mainObject.height = this.objectWH;
        this.addChild(this.mainObject);
        this.objectBeginPoint.x = this.mainObject.x + this.objectWH / 2;
        this.objectBeginPoint.y = this.mainObject.y + this.objectWH;
        this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBegin, this);
        this.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.touchEnd, this);
    };
    Game.prototype.touchBegin = function (event) {
        this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMove, this);
        console.log(event.localX);
        console.log(event.localY);
        this.touchBeginPoint.x = event.localX;
        this.touchBeginPoint.y = event.localY;
    };
    Game.prototype.touchMove = function (event) {
        this.guideLine.graphics.clear();
        this.moveX = this.objectBeginPoint.x + event.localX - this.touchBeginPoint.x;
        this.moveY = this.objectBeginPoint.y + event.localY - this.touchBeginPoint.y;
        var controlX = this.objectBeginPoint.x + (this.moveX - this.objectBeginPoint.x) / 2;
        var controlY = this.objectBeginPoint.y + (this.moveY - this.objectBeginPoint.y) / 2;
        this.guideLine.graphics.lineStyle(5, 0x00ff00);
        this.guideLine.graphics.moveTo(this.objectBeginPoint.x, this.objectBeginPoint.y);
        this.guideLine.graphics.curveTo(controlX, controlY - 10, this.moveX, this.moveY);
        this.guideLine.graphics.endFill();
        this.addChild(this.guideLine);
    };
    Object.defineProperty(Game.prototype, "factor", {
        get: function () {
            return 0;
        },
        set: function (value) {
            this.mainObject.x = (1 - value) * (1 - value) * this.objectBeginPoint.y + 2 * value * (1 - value) * (this.objectBeginPoint.y + (this.moveY - this.objectBeginPoint.y) / 2 - 10) + value * value * this.moveY;
            this.mainObject.y = (1 - value) * (1 - value) * this.objectBeginPoint.x + 2 * value * (1 - value) * (this.objectBeginPoint.x + (this.moveX - this.objectBeginPoint.x) / 2) + value * value * this.moveX;
        },
        enumerable: true,
        configurable: true
    });
    Game.prototype.touchEnd = function (event) {
        egret.Tween.get(this.mainObject).to({ factor: 1 }, 2000);
        this.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMove, this);
        this.guideLine.graphics.clear();
    };
    return Game;
}(egret.DisplayObjectContainer));
__reflect(Game.prototype, "Game");
//# sourceMappingURL=Game.js.map