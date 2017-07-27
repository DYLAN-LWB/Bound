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
        _this.stepArray = []; //阶梯数组
        _this.mainObject = _this.createBitmapByName("beibei_png"); //弹跳对象
        _this.objectWH = 50; //对象宽高
        _this.objectPoint = new egret.Point(0, 0); //对象出发点
        _this.objectBeginY = 300;
        _this.touchPoint = new egret.Point(0, 0); //开始触摸的点
        _this.startX = 200; //初始x值 (台阶中心点为准)
        _this.guideLine = new egret.Shape(); //路径引导线
        _this.maxLen = 150; //箭头的最大长度
        _this.hasHit = false; //如果未碰撞到,恢复对象位置
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
        //舞台背景
        var background = new egret.Sprite;
        background.graphics.beginFill(0xd0efe9, 1);
        background.graphics.drawRect(0, 0, this.stageW, this.stageH);
        background.graphics.endFill();
        this.addChild(background);
        //添加台阶
        for (var i = 0; i < 10; i++) {
            var step = this.createBitmapByName("ladder_png");
            step.y = this.objectBeginY + this.objectWH;
            step.x = Math.random() * 100 + 200 * i + 100;
            step.width = 100;
            step.height = 20;
            this.addChild(step);
            if (i == 0) {
                step.x = this.startX - step.width / 2;
            }
            this.stepArray.push(step);
        }
        this.currentIndex = 0;
        //游戏对象 x值根据台阶来定
        this.mainObject.width = this.objectWH;
        this.mainObject.height = this.objectWH;
        this.mainObject.x = this.startX - this.mainObject.width / 2;
        this.mainObject.y = this.objectBeginY;
        this.addChild(this.mainObject);
        //设置弹跳对象初始位置
        this.objectPoint.x = this.mainObject.x + this.objectWH / 2;
        this.objectPoint.y = this.mainObject.y + this.objectWH;
        //添加touch事件
        this.addTouchEvent();
    };
    Game.prototype.addTouchEvent = function () {
        this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBegin, this);
        this.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.touchEnd, this);
        this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMove, this);
    };
    Game.prototype.removeTouchEvent = function () {
        this.stage.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBegin, this);
        this.stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.touchEnd, this);
        this.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMove, this);
    };
    Game.prototype.touchBegin = function (event) {
        //触摸时拿到触摸点的位置
        this.touchPoint.x = event.localX;
        this.touchPoint.y = event.localY;
    };
    Game.prototype.touchMove = function (event) {
        //清除上次画的箭头
        this.guideLine.graphics.clear();
        //计算触摸点移动到的坐标
        this.moveToX = this.objectPoint.x + (event.localX - this.touchPoint.x);
        this.moveToY = this.objectPoint.y + (event.localY - this.touchPoint.y);
        //勾股定理计算斜边长度
        var powX = Math.pow(this.moveToX - this.objectPoint.x, 2);
        var powY = Math.pow(this.moveToY - this.objectPoint.y, 2);
        this.lineLen = Math.sqrt(powX + powY);
        //长度超过限制,计算最远的点坐标
        if (this.lineLen > this.maxLen) {
            this.lineLen = this.maxLen;
            //实际直角三角形三条边长度
            var moveX = event.localX - this.touchPoint.x;
            var moveY = event.localY - this.touchPoint.y;
            var bias = Math.sqrt(moveX * moveX + moveY * moveY);
            //已知最长斜边,按比例计算另外两条边的长度
            var newX = this.maxLen * moveX / bias;
            var newY = this.maxLen * moveY / bias;
            //计算最长距离的点坐标
            this.moveToX = this.objectPoint.x + newX;
            this.moveToY = this.objectPoint.y + newY;
        }
        //设置箭头的贝塞尔曲线控制点
        var controlX = this.objectPoint.x + (this.moveToX - this.objectPoint.x) / 2;
        var controlY = this.objectPoint.y + (this.moveToY - this.objectPoint.y) / 2;
        //画箭头
        this.guideLine.graphics.lineStyle(5, 0xFF0000);
        this.guideLine.graphics.moveTo(this.objectPoint.x, this.objectPoint.y); //起点
        this.guideLine.graphics.curveTo(controlX, controlY, this.moveToX, this.moveToY); //控制点,终点
        this.guideLine.graphics.endFill();
        this.addChild(this.guideLine);
    };
    Game.prototype.touchEnd = function (event) {
        this.guideLine.graphics.clear();
        //动画时移除交互事件
        this.removeTouchEvent();
        //根据线的长度计算最高点 2倍
        this.highX = this.objectPoint.x + (this.moveToX - this.objectPoint.x) * 3;
        this.highY = this.objectPoint.y - this.objectWH - (this.objectPoint.y - this.moveToY) * 3;
        if (this.highY < 0) {
            this.highY = 0;
        }
        //缓动动画
        egret.Tween.get(this).to({ factor: 1 }, 2000).call(function () {
            //动画结束之后如果未发生碰撞, 恢复对象位置 - 复活重玩
            if (this.hasHit == false) {
                var firstStep = this.stepArray[this.currentIndex];
                this.mainObject.x = firstStep.x + firstStep.width / 2 - this.mainObject.width / 2;
                this.mainObject.y = this.objectBeginY;
            }
            //动画结束后重新添加交互事件
            this.addTouchEvent();
        }, this);
    };
    Object.defineProperty(Game.prototype, "factor", {
        get: function () {
            return 0;
        },
        set: function (value) {
            this.mainObject.x = (1 - value) * (1 - value) * this.objectPoint.x + 2 * value * (1 - value) * this.highX + value * value * (this.highX * 2 - this.objectPoint.x);
            this.mainObject.y = (1 - value) * (1 - value) * (this.objectPoint.y - this.objectWH) + 2 * value * (1 - value) * (this.highY - 300) + value * value * (this.stageH - this.objectWH);
            for (var i = 0; i < this.stepArray.length; i++) {
                var step = this.stepArray[i];
                var isHit = step.hitTestPoint(this.mainObject.x + this.mainObject.width / 2, this.mainObject.y + this.mainObject.height, true);
                if (isHit) {
                    //发生碰撞,移除缓动动画
                    egret.Tween.removeTweens(this);
                    console.log("isHit");
                    this.hasHit = true;
                    //移动容器
                    // this.stepSprite1.x -= this.averageWidth;
                    //完全消失时, 改变数组顺序
                    // this.currentIndex = 0;
                    // this.currentStepArray = this.stepArray.slice(this.currentIndex, this.currentIndex+5); 
                    //移动之后重新添加交互事件
                    this.addTouchEvent();
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    return Game;
}(egret.DisplayObjectContainer));
__reflect(Game.prototype, "Game");
//# sourceMappingURL=Game.js.map