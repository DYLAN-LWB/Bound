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
        _this.objectPoint = new egret.Point(0, 0); //出发点
        _this.objectWH = 50;
        _this.touchPoint = new egret.Point(0, 0);
        _this.guideLine = new egret.Shape(); //方向引导线
        _this.maxLen = 500;
        _this.speedTime = 2;
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
        //舞台背景图片
        var stageBackground = this.createBitmapByName("testbg_png");
        stageBackground.x = 0;
        stageBackground.y = 0;
        stageBackground.width = this.stageW;
        stageBackground.height = this.stageH;
        this.addChild(stageBackground);
        //游戏对象
        this.mainObject.x = 100;
        this.mainObject.y = 200;
        this.mainObject.width = this.objectWH;
        this.mainObject.height = this.objectWH;
        this.addChild(this.mainObject);
        //设置弹跳对象初始位置
        this.objectPoint.x = this.mainObject.x + this.objectWH / 2;
        this.objectPoint.y = this.mainObject.y + this.objectWH;
        //添加touch事件
        this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBegin, this);
        this.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.touchEnd, this);
    };
    Game.prototype.touchBegin = function (event) {
        this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMove, this);
        //触摸时拿到触摸点的位置
        this.touchPoint.x = event.localX;
        this.touchPoint.y = event.localY;
    };
    Game.prototype.touchMove = function (event) {
        //清除上次画的线
        this.guideLine.graphics.clear();
        //计算x,y移动到的位置
        this.moveToX = this.objectPoint.x + (event.localX - this.touchPoint.x);
        this.moveToY = this.objectPoint.y + (event.localY - this.touchPoint.y);
        console.log("x=" + this.moveToX + "y=" + this.moveToY);
        // if((this.moveToX*this.moveToX + this.moveToY*this.moveToY) > this.maxLen*this.maxLen) {
        // 	console.log("长度超出");
        // }
        //设置贝塞尔曲线控制点
        var controlX = this.objectPoint.x + (this.moveToX - this.objectPoint.x) / 2;
        var controlY = this.objectPoint.y + (this.moveToY - this.objectPoint.y) / 2;
        //画贝塞尔曲线
        this.guideLine.graphics.lineStyle(5, 0x00ff00);
        this.guideLine.graphics.moveTo(this.objectPoint.x, this.objectPoint.y); //起点
        this.guideLine.graphics.curveTo(controlX, controlY - 15, this.moveToX, this.moveToY); //控制点,终点
        // this.guideLine.graphics.lineTo(this.moveToX, this.moveToY);	//控制点,终点
        this.guideLine.graphics.endFill();
        this.addChild(this.guideLine);
    };
    Game.prototype.touchEnd = function (event) {
        this.guideLine.graphics.clear();
        this.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMove, this);
        //对象沿曲线方向抛物线运动
        this.speedX = this.moveToX / 100;
        this.speedY = this.moveToY / 100;
        egret.Tween.get(this.mainObject).to({ x: 666 }, 1000 * this.speedTime);
    };
    return Game;
}(egret.DisplayObjectContainer));
__reflect(Game.prototype, "Game");
//# sourceMappingURL=Game.js.map