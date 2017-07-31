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
        _this.totalStep = 10;
        _this.stepArray = []; //阶梯数组
        _this.startX = 200; //初始x值 (台阶中心点为准)
        _this.metersCount = 0; //走的总米数
        _this.wordArray = ["a", "p", "p", "l", "e"];
        //object
        _this.mainObject = _this.createBitmapByName("beibei_png"); //弹跳对象
        _this.objectWH = 80; //对象宽高
        _this.objectPoint = new egret.Point(0, 0); //对象出发点
        _this.objectBeginY = 350;
        //touch and line
        _this.touchPoint = new egret.Point(0, 0); //开始触摸的点
        _this.guideLine = new egret.Shape(); //路径引导线
        _this.maxLen = 150; //箭头的最大长度
        //hit
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
        //背景云彩
        this.addCloud();
        //添加台阶, 台阶添加背景容器来控制x值
        for (var i = 0; i < this.totalStep; i++) {
            var step = this.createBitmapByName("ladder_png");
            step.y = this.objectBeginY + this.objectWH;
            step.x = Math.random() * 100 + 200 * i + 120;
            step.width = 120;
            step.height = 25;
            this.addChild(step);
            if (i == 0) {
                step.x = this.startX - step.width / 2;
            }
            if (i > 0 && i < this.wordArray.length + 1) {
                var word = new egret.TextField();
                word.x = step.x;
                word.y = step.y - 40;
                word.width = 120;
                word.height = 40;
                word.textColor = 0xFF0000;
                word.textAlign = egret.HorizontalAlign.CENTER;
                word.size = 30;
                word.text = this.wordArray[i - 1];
            }
            this.stepArray.push(step);
        }
        //游戏对象
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
        this.metersLabel = new egret.TextField();
        this.metersLabel.x = 0;
        this.metersLabel.y = 20;
        this.metersLabel.width = this.stageW;
        this.metersLabel.height = 55;
        this.metersLabel.textColor = 0xFF0000;
        this.metersLabel.textAlign = egret.HorizontalAlign.CENTER;
        this.metersLabel.size = 30;
        this.metersLabel.text = "您已经走了" + this.metersCount + "米";
        this.addChild(this.metersLabel);
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
        //重置
        this.hasHit = false;
    };
    Game.prototype.touchMove = function (event) {
        //清除上次画的箭头
        this.guideLine.graphics.clear();
        //控制点超出屏幕时容错
        if (event.localY < 0) {
            this.moveToY = 0;
            console.log("超出屏幕");
        }
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
        if (this.moveToX < this.objectPoint.x) {
            this.moveToX = this.objectPoint.x;
        }
        if (this.moveToY > this.objectPoint.y) {
            this.moveToY = this.objectPoint.y;
        }
        //设置箭头的贝塞尔曲线控制点
        var controlX = this.objectPoint.x + (this.moveToX - this.objectPoint.x) / 2;
        var controlY = this.objectPoint.y + (this.moveToY - this.objectPoint.y) / 2;
        //画箭头
        this.guideLine.graphics.lineStyle(5, 0xFFFFFF);
        this.guideLine.graphics.moveTo(this.objectPoint.x, this.objectPoint.y); //起点
        this.guideLine.graphics.curveTo(controlX, controlY, this.moveToX, this.moveToY); //控制点,终点
        this.guideLine.graphics.endFill();
        this.addChild(this.guideLine);
    };
    Game.prototype.touchEnd = function (event) {
        //清楚箭头
        this.guideLine.graphics.clear();
        //动画时移除交互事件
        this.removeTouchEvent();
        //根据线的长度计算最高点 2倍
        this.highX = this.objectPoint.x + (this.moveToX - this.objectPoint.x) * 4;
        this.highY = this.objectPoint.y - this.objectWH - (this.objectPoint.y - this.moveToY) * 4;
        //缓动动画
        egret.Tween.get(this).to({ factor: 1 }, 1000).call(function () {
            //动画结束之后如果未发生碰撞, 恢复对象位置 - 复活重玩
            if (this.hasHit == false) {
                var firstStep = this.stepArray[0];
                this.mainObject.x = firstStep.x + firstStep.width / 2 - this.mainObject.width / 2;
                this.mainObject.y = this.objectBeginY;
            }
            //动画结束后重新添加交互事件 (未发生碰撞)
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
            this.observeHit();
        },
        enumerable: true,
        configurable: true
    });
    Game.prototype.observeHit = function () {
        for (var index = 0; index < this.stepArray.length; index++) {
            var step = this.stepArray[index];
            var isHit = step.hitTestPoint(this.mainObject.x + this.mainObject.width / 2, this.mainObject.y + this.mainObject.height, true);
            if (isHit) {
                this.hitAction(index);
            }
        }
    };
    Game.prototype.hitAction = function (hitIndex) {
        //发生碰撞,设置Y值, 移除缓动动画
        this.mainObject.y = this.objectBeginY;
        egret.Tween.removeTweens(this);
        //不重置对象位置,跳跃成功,不死
        this.hasHit = true;
        //要移动的距离 = 跳到的台阶的中心点 - 初始x值
        var moveLen = this.stepArray[hitIndex].x + this.stepArray[hitIndex].width / 2 - this.startX;
        //移动米数
        this.metersCount += Math.round(moveLen / 100);
        this.metersLabel.text = "您已经走了" + this.metersCount + "米";
        //遍历数组 改变x值
        for (var j = 0; j < this.stepArray.length; j++) {
            var ste = this.stepArray[j];
            egret.Tween.get(ste).to({ x: ste.x - moveLen }, 300);
        }
        //改变对象x值
        egret.Tween.get(this.mainObject).to({ x: this.startX - this.mainObject.width / 2 }, 300);
        //删除0到i(脚下之前)的台阶 
        for (var del = 0; del < hitIndex; del++) {
            this.removeChild(this.stepArray[del]);
        }
        //删除跳跃过的数据
        this.stepArray.splice(0, hitIndex);
        this.newCount = hitIndex;
        //台阶动画结束后再执行
        var timer = new egret.Timer(350, 1);
        timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.tweenComplete, this);
        timer.start();
    };
    Game.prototype.tweenComplete = function () {
        //拿到最后一个台阶的x值
        var endStep = this.stepArray[this.stepArray.length - 1];
        //末尾添加台阶index
        for (var addCount = 0; addCount < this.newCount; addCount++) {
            var step = this.createBitmapByName("ladder_png");
            step.y = this.objectBeginY + this.objectWH;
            step.x = Math.random() * 100 + 200 * addCount + endStep.x + 250;
            step.width = 120;
            step.height = 25;
            this.addChild(step);
            //添加新增的台阶
            this.stepArray.push(step);
        }
        //移动之后重新添加交互事件
        this.addTouchEvent();
    };
    //加速
    Game.prototype.speedUp = function () {
        var timer = new egret.Timer(350, 20);
        timer.addEventListener(egret.TimerEvent.TIMER, this.timerFunc, this);
        timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.timerComFunc, this);
        timer.start();
    };
    Game.prototype.timerFunc = function () {
    };
    Game.prototype.timerComFunc = function () {
    };
    //添加背景
    Game.prototype.addCloud = function () {
        //舞台背景
        var background = new egret.Sprite;
        background.graphics.beginFill(0x7AC5CD, 1);
        background.graphics.drawRect(0, 0, this.stageW, this.stageH);
        background.graphics.endFill();
        this.addChild(background);
        var cloud1 = this.createBitmapByName("yun01_png");
        cloud1.x = 20;
        cloud1.y = 111;
        cloud1.width = 97;
        cloud1.height = 70;
        this.addChild(cloud1);
        egret.Tween.get(cloud1, { loop: true }).to({ x: this.stageW }, 35000).to({ x: -100 }, 35000);
        var cloud2 = this.createBitmapByName("yun03_png");
        cloud2.x = 200;
        cloud2.y = 211;
        cloud2.width = 144;
        cloud2.height = 82;
        this.addChild(cloud2);
        egret.Tween.get(cloud2, { loop: true }).to({ x: this.stageW }, 50000).to({ x: -200 }, 50000);
        var cloud3 = this.createBitmapByName("yun02_png");
        cloud3.x = 640;
        cloud3.y = 500;
        cloud3.width = 73;
        cloud3.height = 44;
        this.addChild(cloud3);
        egret.Tween.get(cloud3, { loop: true }).to({ x: -100 }, 30000).to({ x: this.stageW }, 30000);
        var cloud4 = this.createBitmapByName("yun04_png");
        cloud4.x = 40;
        cloud4.y = 644;
        cloud4.width = 112;
        cloud4.height = 76;
        this.addChild(cloud4);
        egret.Tween.get(cloud4, { loop: true }).to({ x: this.stageW }, 40000).to({ x: -120 }, 40000);
    };
    return Game;
}(egret.DisplayObjectContainer));
__reflect(Game.prototype, "Game");
//# sourceMappingURL=Game.js.map