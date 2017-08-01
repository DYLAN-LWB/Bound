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
        //USER
        //public
        _this._totalStepCount = 5; //台阶数量
        _this._lifeCount = 1; //x条命
        _this._stepBeginX = 200; //初始x值 (台阶中心点为准)
        _this._scends = 180; //游戏默认180秒
        _this._score = 0; //走的总米数
        _this._isGameOver = true; //游戏是否结束
        _this._stepsArray = []; //阶梯数组
        _this._letterArray = []; //字母数组只在每次新增台阶之后删除对象数量的字母
        _this._letterTFArray = []; //字母textfield
        _this._letterImgArray = []; //字母图片数组
        _this._person = new Bitmap("beibei_png"); //弹跳对象
        _this._personBeginPoint = new egret.Point(0, 0); //对象出发点
        _this._personTopY = 350; //对象的Y值,控制弹跳对象和台阶
        _this._personWH = 80; //对象宽高
        _this._guideLine = new egret.Shape(); //线条引导
        _this._guideArrow = new Bitmap("ladder_png"); //箭头引导
        _this._historyArrow = new Bitmap("ladder_png"); //上次箭头引导轨迹
        _this._touchBeginPoint = new egret.Point(0, 0); //开始触摸的点
        _this._guideMaxLength = 150; //箭头的最大长度
        _this._isHit = false; //如果未碰撞到,恢复对象位置
        _this.letterString = "";
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    Game.prototype.onAddToStage = function (event) {
        //游戏背景
        var _gameBackground = new GameBackground(this.stage.stageWidth, this.stage.stageHeight);
        this.addChild(_gameBackground);
        //请求单词
        this.getWords();
        //添加台阶
        this.setupSteps();
        //添加游戏人物
        this.setupPerson();
        //添加提示信息
        this.setupReminder();
        //添加touch事件
        this.addTouchEvent();
    };
    //设置台阶
    Game.prototype.setupSteps = function () {
        //第一个台阶特殊 手动创建
        var firstStep = new Bitmap("ladder_png");
        firstStep.width = 120;
        firstStep.height = 25;
        firstStep.y = this._personTopY + this._personWH;
        firstStep.x = this._stepBeginX - firstStep.width / 2;
        this.addChild(firstStep);
        //添加到台阶数组
        this._stepsArray.push(firstStep);
        //前一个台阶的x值
        var _frontStepX = firstStep.x;
        //添加台阶
        for (var i = 0; i < this._totalStepCount; i++) {
            //创建台阶
            var _step = new Bitmap("ladder_png");
            _step.width = 120;
            _step.height = 25;
            _step.y = this._personTopY + this._personWH;
            _step.x = _frontStepX + _step.width + 50 + Math.random() * 300;
            this.addChild(_step);
            //添加到台阶数组
            this._stepsArray.push(_step);
            //重置前一个台阶的x值
            _frontStepX = _step.x;
            //添加字母文字,方便碰撞时拿到字母
            var _letterTF = new egret.TextField();
            _letterTF.x = _step.x;
            _letterTF.y = _step.y - 40;
            _letterTF.width = 30;
            _letterTF.height = 40;
            _letterTF.text = this._letterArray[i];
            _letterTF.alpha = 0;
            this.addChild(_letterTF);
            //添加到字母数组
            this._letterTFArray.push(_letterTF);
            //添加字母图片
            var _letterImg = new Bitmap("letter_json." + _letterTF.text);
            _letterImg.width = 40;
            _letterImg.height = 40;
            _letterImg.y = _step.y - 40;
            _letterImg.x = _step.x + 40;
            this.addChild(_letterImg);
            //添加到字母图片数组
            this._letterImgArray.push(_letterImg);
        }
        //每次添加台阶都要删除对应数量的字母
        this._letterArray.splice(0, this._totalStepCount);
    };
    //设置对象
    Game.prototype.setupPerson = function () {
        this._person.width = this._personWH;
        this._person.height = this._personWH;
        this._person.x = this._stepBeginX - this._person.width / 2;
        this._person.y = this._personTopY;
        this.addChild(this._person);
        //设置弹跳对象初始坐标
        this._personBeginPoint.x = this._person.x + this._personWH / 2;
        this._personBeginPoint.y = this._person.y + this._personWH;
    };
    //设置提示文字,分数,倒计时
    Game.prototype.setupReminder = function () {
        //分数提示
        this._scoreLabel = new egret.TextField();
        this._scoreLabel.x = 0;
        this._scoreLabel.y = 20;
        this._scoreLabel.width = this.stage.stageWidth;
        this._scoreLabel.height = 55;
        this._scoreLabel.textColor = 0xFF0000;
        this._scoreLabel.textAlign = egret.HorizontalAlign.CENTER;
        this._scoreLabel.size = 30;
        this._scoreLabel.text = "您已经走了" + this._score + "米";
        this.addChild(this._scoreLabel);
        //倒计时提示
        //指示箭头提示
        this._guideArrow = new Bitmap("ladder_png");
        this._guideArrow.y = this._personBeginPoint.y;
        this._guideArrow.x = this._personBeginPoint.x;
        this._guideArrow.width = 0;
        this._guideArrow.height = 0;
        // this.addChild(this._guideArrow);
    };
    //添加触摸事件
    Game.prototype.addTouchEvent = function () {
        this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBegin, this);
        this.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.touchEnd, this);
        this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMove, this);
    };
    //移除触摸事件
    Game.prototype.removeTouchEvent = function () {
        this.stage.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBegin, this);
        this.stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.touchEnd, this);
        this.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMove, this);
    };
    //开始触摸
    Game.prototype.touchBegin = function (event) {
        //触摸时拿到触摸点的位置
        this._touchBeginPoint.x = event.localX;
        this._touchBeginPoint.y = event.localY;
        //重置
        this._isHit = false;
    };
    //触摸点移动
    Game.prototype.touchMove = function (event) {
        //清除上次画的箭头
        this._guideLine.graphics.clear();
        //初始化箭头
        this._guideArrow.width = 0;
        this._guideArrow.height = 0;
        this._guideArrow.rotation = 0;
        //控制点超出屏幕时容错
        if (event.localY < 0) {
            this._touchMoveToY = 0;
            console.log("超出屏幕");
        }
        //计算触摸点移动到的坐标
        this._touchMoveToX = this._personBeginPoint.x + (event.localX - this._touchBeginPoint.x);
        this._touchMoveToY = this._personBeginPoint.y + (event.localY - this._touchBeginPoint.y);
        //勾股定理计算斜边长度
        var powX = Math.pow(this._touchMoveToX - this._personBeginPoint.x, 2);
        var powY = Math.pow(this._touchMoveToY - this._personBeginPoint.y, 2);
        this._guideTruthLength = Math.sqrt(powX + powY);
        //长度超过限制,计算最远的点坐标
        if (this._guideTruthLength > this._guideMaxLength) {
            this._guideTruthLength = this._guideMaxLength;
            //实际直角三角形三条边长度
            var moveX = event.localX - this._touchBeginPoint.x;
            var moveY = event.localY - this._touchBeginPoint.y;
            var bias = Math.sqrt(moveX * moveX + moveY * moveY);
            //已知最长斜边,按比例计算另外两条边的长度
            var newX = this._guideMaxLength * moveX / bias;
            var newY = this._guideMaxLength * moveY / bias;
            //计算最长距离的点坐标
            this._touchMoveToX = this._personBeginPoint.x + newX;
            this._touchMoveToY = this._personBeginPoint.y + newY;
        }
        if (this._touchMoveToX < this._personBeginPoint.x) {
            this._touchMoveToX = this._personBeginPoint.x;
            this._touchMoveToY = this._personBeginPoint.y - this._guideTruthLength;
        }
        if (this._touchMoveToY > this._personBeginPoint.y) {
            this._touchMoveToY = this._personBeginPoint.y;
            this._touchMoveToX = this._personBeginPoint.x + this._guideTruthLength;
        }
        //计算角度来旋转箭头
        //cosB = a/c
        var radian = (this._touchMoveToX - this._personBeginPoint.x) / (this._personBeginPoint.y - this._touchMoveToY);
        //通过弧度Math.atan(radian) 计算角度 1弧度＝180°/π （≈57.3°）
        var angle = 90 - Math.atan(radian) * 180 / Math.PI;
        this._guideArrow.width = this._guideTruthLength;
        this._guideArrow.height = 10;
        this._guideArrow.rotation = -angle;
        //设置箭头的贝塞尔曲线控制点
        var controlX = this._personBeginPoint.x + (this._touchMoveToX - this._personBeginPoint.x) / 2;
        var controlY = this._personBeginPoint.y + (this._touchMoveToY - this._personBeginPoint.y) / 2 - 10;
        //画箭头
        this._guideLine.graphics.lineStyle(5, 0xFFFFFF);
        this._guideLine.graphics.moveTo(this._personBeginPoint.x, this._personBeginPoint.y); //起点
        this._guideLine.graphics.curveTo(controlX, controlY, this._touchMoveToX, this._touchMoveToY); //控制点,终点
        this._guideLine.graphics.endFill();
        this.addChild(this._guideLine);
    };
    //触摸结束
    Game.prototype.touchEnd = function (event) {
        //清除箭头
        this._guideLine.graphics.clear();
        //初始化箭头
        this._guideArrow.width = 0;
        this._guideArrow.height = 0;
        this._guideArrow.rotation = 0;
        //创建历史轨迹箭头
        var radian = (this._touchMoveToX - this._personBeginPoint.x) / (this._personBeginPoint.y - this._touchMoveToY);
        var angle = 90 - Math.atan(radian) * 180 / Math.PI;
        this._historyArrow.y = this._personBeginPoint.y;
        this._historyArrow.x = this._personBeginPoint.x;
        this._historyArrow.width = this._guideTruthLength;
        this._historyArrow.height = 10;
        this._historyArrow.rotation = -angle;
        this._historyArrow.alpha = 0.2;
        // this.addChild(this._historyArrow);
        //动画时移除交互事件
        this.removeTouchEvent();
        //根据线的长度计算最高点 2倍
        this._pathHighX = this._personBeginPoint.x + (this._touchMoveToX - this._personBeginPoint.x) * 4;
        this._pathHighY = this._personBeginPoint.y - this._personWH - (this._personBeginPoint.y - this._touchMoveToY) * 4;
        //缓动动画
        egret.Tween.get(this).to({ factor: 1 }, 1000).call(function () {
            //动画结束之后如果未发生碰撞, 恢复对象位置 - 复活重玩
            if (this._isHit == false) {
                var firstStep = this._stepsArray[0];
                this._person.x = firstStep.x + firstStep.width / 2 - this._person.width / 2;
                this._person.y = this._personTopY;
                this._lifeCount -= 1;
                if (this._lifeCount == 0) {
                    // _normalAlert("game over");
                    this._normalAlert = new Alert(Alert.GamePageScore, "111", "11", "333", 123, this.stage.stageHeight);
                    this._normalAlert.x = 0;
                    this._normalAlert.y = 0;
                    this.addChild(this._normalAlert);
                    this._normalAlert.addEventListener(AlertEvent.Ranking, this.checkRanking, this);
                    this._normalAlert.addEventListener(AlertEvent.Restart, this.restartGame, this);
                }
            }
            //动画结束后重新添加交互事件 (未发生碰撞)
            this.addTouchEvent();
        }, this);
    };
    Object.defineProperty(Game.prototype, "factor", {
        //二次贝塞尔曲线的缓动动画实现方式
        get: function () {
            return 0;
        },
        set: function (value) {
            this._person.x = (1 - value) * (1 - value) * this._personBeginPoint.x + 2 * value * (1 - value) * this._pathHighX + value * value * (this._pathHighX * 2 - this._personBeginPoint.x);
            this._person.y = (1 - value) * (1 - value) * (this._personBeginPoint.y - this._personWH) + 2 * value * (1 - value) * (this._pathHighY - 300) + value * value * (this.stage.stageHeight - this._personWH);
            //动画过程中检测碰撞
            this.checkHit();
        },
        enumerable: true,
        configurable: true
    });
    //碰撞检测
    Game.prototype.checkHit = function () {
        for (var index = 0; index < this._stepsArray.length; index++) {
            var _step = this._stepsArray[index];
            var _isHit = _step.hitTestPoint(this._person.x + this._person.width / 2, this._person.y + this._person.height, true);
            if (_isHit) {
                this.hitAction(index);
            }
        }
    };
    //发生碰撞
    Game.prototype.hitAction = function (hitIndex) {
        //清除历史箭头
        if (this._historyArrow && this._historyArrow.parent) {
            this._historyArrow.parent.removeChild(this._historyArrow);
        }
        ;
        //发生碰撞,设置Y值, 移除弹跳对象的缓动动画
        this._person.y = this._personTopY;
        egret.Tween.removeTweens(this);
        //不重置对象位置,跳跃成功,不死
        this._isHit = true;
        //要移动的距离 = 跳到的台阶的中心点 - 初始x值
        var moveLen = this._stepsArray[hitIndex].x + this._stepsArray[hitIndex].width / 2 - this._stepBeginX;
        //拿到目标台阶上的字母
        if (hitIndex > 0) {
            var wordTF = this._letterTFArray[hitIndex - 1];
            this.addLetter(wordTF.text);
        }
        //移动米数
        this._score += Math.round(moveLen / 100);
        this._scoreLabel.text = "您已经走了" + this._score + "米";
        //遍历数组 改变台阶x值
        for (var j = 0; j < this._stepsArray.length; j++) {
            var ste = this._stepsArray[j];
            egret.Tween.get(ste).to({ x: ste.x - moveLen }, 300);
        }
        //遍历数组 改变字母x值
        for (var z = 0; z < this._letterTFArray.length; z++) {
            var word = this._letterTFArray[z];
            egret.Tween.get(word).to({ x: word.x - moveLen }, 300);
            var wordImg = this._letterImgArray[z];
            egret.Tween.get(wordImg).to({ x: wordImg.x - moveLen }, 300);
        }
        //改变弹跳对象x值
        egret.Tween.get(this._person).to({ x: this._stepBeginX - this._person.width / 2 }, 300);
        this._hitIndex = hitIndex;
        //台阶动画结束后再执行
        var timer = new egret.Timer(310, 1);
        timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.stepTweenComplete, this);
        timer.start();
    };
    //台阶,字母移动动画结束
    Game.prototype.stepTweenComplete = function () {
        //删除0到i(脚下之前)的台阶 
        for (var i = 0; i < this._hitIndex; i++) {
            if (this._stepsArray[i] && this._stepsArray[i].parent) {
                this._stepsArray[i].parent.removeChild(this._stepsArray[i]);
            }
            ;
        }
        //删除跳跃过的数据
        this._stepsArray.splice(0, this._hitIndex);
        //删除0到i的字母
        for (var i = 0; i < this._hitIndex; i++) {
            if (this._letterTFArray[i] && this._letterTFArray[i].parent) {
                this._letterTFArray[i].parent.removeChild(this._letterTFArray[i]);
                this._letterImgArray[i].parent.removeChild(this._letterImgArray[i]);
            }
            ;
        }
        console.log(this._hitIndex);
        //删除跳跃过的数据
        this._letterTFArray.splice(0, this._hitIndex);
        this._letterImgArray.splice(0, this._hitIndex);
        //拿到最后一个台阶的x值
        var _lastStep = this._stepsArray[this._stepsArray.length - 1];
        //新增台阶的前一个台阶的x值
        var _frontX = _lastStep.x;
        //末尾添加台阶index
        for (var i = 0; i < this._hitIndex; i++) {
            var _step = new Bitmap("ladder_png");
            _step.y = this._personTopY + this._personWH;
            _step.x = _frontX + _step.width + Math.random() * 300;
            _step.width = 120;
            _step.height = 25;
            this.addChild(_step);
            //重置前一个台阶的x值
            _frontX = _step.x;
            //添加新增的台阶
            this._stepsArray.push(_step);
            //添加字母文字,方便碰撞时拿到字母
            var _letterTF = new egret.TextField();
            _letterTF.x = _step.x;
            _letterTF.y = _step.y - 40;
            _letterTF.width = 30;
            _letterTF.height = 40;
            _letterTF.text = this._letterArray[i];
            _letterTF.alpha = 0;
            this.addChild(_letterTF);
            //添加到字母数组
            this._letterTFArray.push(_letterTF);
            //添加字母图片
            var _letterImg = new Bitmap("letter_json." + _letterTF.text);
            _letterImg.width = 40;
            _letterImg.height = 40;
            _letterImg.y = _step.y - 40;
            _letterImg.x = _step.x + 40;
            this.addChild(_letterImg);
            //添加到字母图片数组
            this._letterImgArray.push(_letterImg);
        }
        this._letterArray.splice(0, this._hitIndex);
        //移动之后重新添加交互事件
        this.addTouchEvent();
    };
    Game.prototype.addLetter = function (letter) {
        this.letterString += letter;
        console.log("吃到的单词 = " + this.letterString);
        if (this.letterString === "good") {
            //加速动画
            var speed = new SpeedMotion();
            this.addChild(speed);
            //加米数
            var timer = new egret.Timer(300, 1);
            timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, function () {
                this._score += 50;
                this._scoreLabel.text = "您已经走了" + this._score + "米";
            }, this);
            timer.start();
        }
    };
    //游戏结束alert-查看排名
    Game.prototype.checkRanking = function () {
        console.log("game checkRanking");
        // this.removeChild(this._normalAlert);
        // window.location.href = "https://www.beisu100.com/beisuapp/gamerank/rank/timenum/" + this.timenum + "/activitynum/" + this.activitynum + "/vuid/" + this._vuid + "/key/" + this._key + "/isfrom/" + this.isfrom;
    };
    //游戏结束alert-重玩
    Game.prototype.restartGame = function () {
        console.log("game restartGame");
        // this.removeChildren();
        // this._scends = 180;
        // this.Score = 0;
        // this._isGameOver = true;
        // this.downNum(this._vuid, this._key);
    };
    //请求单词接口
    Game.prototype.getWords = function () {
        this._letterArray = ["g", "o", "o", "d", "a", "p", "p", "l", "e", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
    };
    return Game;
}(egret.DisplayObjectContainer));
__reflect(Game.prototype, "Game");
//# sourceMappingURL=Game.js.map