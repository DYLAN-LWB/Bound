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
        _this._info = new Info(); //公用信息表
        //public
        _this._totalStepCount = 5; //台阶数量
        _this._stepBeginX = 200; //初始x值 (台阶中心点为准)
        _this._lifeCount = 10; //x条命
        _this._score = 0; //走的总米数
        _this._gameEnd = false;
        _this._stepsArray = []; //阶梯数组
        _this._letterArray = []; //字母数组只在每次新增台阶之后删除对象数量的字母
        _this._letterTFArray = []; //字母textfield
        _this._letterImgArray = []; //字母图片数组
        _this._allWords = []; //所有单词数组,用来检测吃到的单词对错
        _this._allWordsExplain = []; //所有单词数组,用来检测吃到的单词对错
        _this._person = new Bitmap("beibei_png"); //弹跳对象
        _this._personBeginPoint = new egret.Point(0, 0); //对象出发点
        _this._personTopY = 350; //对象的Y值,控制弹跳对象和台阶
        _this._personWH = 110; //对象宽高
        _this._guideLine = new egret.Shape(); //线条引导
        _this._touchBeginPoint = new egret.Point(0, 0); //开始触摸的点
        _this._guideMaxLength = 300; //箭头的最大长度
        _this._isHit = false; //如果未碰撞到,恢复对象位置
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.createGameScene, _this);
        return _this;
    }
    Game.prototype.createGameScene = function () {
        //游戏背景
        var _gameBackground = new GameBackground(this.stage.stageWidth, this.stage.stageHeight);
        this.addChild(_gameBackground);
        this._info._vuid = localStorage.getItem("vuid").replace(/"/g, "");
        this._info._key = localStorage.getItem("key").replace(/"/g, "");
        this._info._isfrom = localStorage.getItem("isfrom").replace(/"/g, "");
        this._info._timenum = localStorage.getItem("timenum").replace(/"/g, "");
        this._info._activitynum = localStorage.getItem("activitynum").replace(/"/g, "");
        //减游戏次数
        this.minusGameCount();
    };
    //接口-请求单词, 只在初次请求时添加UI
    Game.prototype.getWords = function (type) {
        var params = "?vuid=" + this._info._vuid +
            "&key=" + this._info._key +
            "&rands=" + this._rands +
            "&isfrom=" + this._info._isfrom;
        // alert("请求单词接口 - "+this._info._getWord + params);
        var request = new egret.HttpRequest();
        request.responseType = egret.HttpResponseType.TEXT;
        console.log(this._info._getWord + params);
        request.open(this._info._getWord + params, egret.HttpMethod.GET);
        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        request.send();
        request.addEventListener(egret.Event.COMPLETE, function () {
            var result = JSON.parse(request.response);
            console.log(result);
            if (result["code"] == 0) {
                if (type == 3) {
                    this._wordTF.text = "单词：";
                    for (var i = 0; i < this._letterTFArray.length; i++) {
                        this.removeChild(this._stepsArray[i]);
                    }
                    for (var z = 0; z < this._letterTFArray.length; z++) {
                        this.removeChild(this._letterTFArray[z]);
                        this.removeChild(this._letterImgArray[z]);
                    }
                    this._letterArray.splice(0, this._letterArray.length);
                    this._letterTFArray.splice(0, this._letterTFArray.length);
                    this._letterImgArray.splice(0, this._letterImgArray.length);
                    this._stepsArray.splice(0, this._stepsArray.length);
                    this._allWords.splice(0, this._allWords.length);
                    this._allWordsExplain.splice(0, this._allWordsExplain.length);
                }
                var wordArray = [];
                var explainArray = [];
                for (var i = 0; i < result["data"].length; i++) {
                    var word = result["data"][i]["word"];
                    word = word.replace(/\s/g, "").replace(/\./g, "").toLowerCase();
                    wordArray.push(word);
                    var explain = result["data"][i]["explain"];
                    explainArray.push(explain);
                }
                Array.prototype.push.apply(this._allWords, wordArray); //将请求到的单词添加到大数组
                Array.prototype.push.apply(this._allWordsExplain, explainArray); //将请求到的单词添加到大数组
                var wordsString = wordArray.join().replace(/,/g, ""); //将单词数组转为字符串,并且去掉所有逗号
                var newLetters = wordsString.split(""); //将字母字符串转为数组
                Array.prototype.push.apply(this._letterArray, newLetters); //追加到字母数组
                //接口请求成功添加UI
                if (type == 1) {
                    this.setupSteps(); //添加台阶
                    this.setupPerson(); //添加游戏人物
                    this.setupReminder(); //添加提示信息,其他
                    this.addTouchEvent(); //添加touch事件
                    this._remindWordTF.text = "任务单词：" + this._allWords[0];
                    this._remindExplainTF.text = this._allWordsExplain[0];
                }
                else if (type == 3) {
                    this.setupSteps(); //添加台阶
                    this._remindWordTF.text = "任务单词：" + this._allWords[0];
                    this._remindExplainTF.text = this._allWordsExplain[0];
                }
            }
            else {
                alert(result["msg"]);
            }
        }, this);
        request.addEventListener(egret.IOErrorEvent.IO_ERROR, function () {
            alert("post error : " + event);
        }, this);
    };
    //设置台阶
    Game.prototype.setupSteps = function () {
        this._stepBeginX = 200;
        //第一个台阶特殊 手动创建
        var firstStep = new Bitmap("step_png");
        firstStep.width = 130;
        firstStep.height = 30;
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
            var _step = new Bitmap("step_png");
            _step.width = 130;
            _step.height = 30;
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
            _letterImg.width = 60;
            _letterImg.height = 60;
            _letterImg.y = _step.y - 60;
            _letterImg.x = _step.x + 35;
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
        var wordBg = new Bitmap("wordBg_png");
        wordBg.x = (this.stage.stageWidth - 454) / 2;
        wordBg.y = 0;
        wordBg.width = 454;
        wordBg.height = 96;
        this.addChild(wordBg);
        //单词提示
        this._wordTF = new egret.TextField();
        this._wordTF.x = this.stage.stageWidth * 0.25;
        this._wordTF.y = 30;
        this._wordTF.width = this.stage.stageWidth * 0.5;
        this._wordTF.height = 50;
        this._wordTF.textColor = 0xff6600;
        this._wordTF.textAlign = egret.HorizontalAlign.CENTER;
        this._wordTF.size = 32;
        this._wordTF.text = "单词：";
        this._wordTF.fontFamily = "Microsoft YaHei";
        this.addChild(this._wordTF);
        //分数提示
        this._scoreTF = new egret.TextField();
        this._scoreTF.x = this.stage.stageWidth * 0.25;
        this._scoreTF.y = 120;
        this._scoreTF.width = this.stage.stageWidth * 0.5;
        this._scoreTF.height = 55;
        this._scoreTF.textColor = 0x20544a;
        this._scoreTF.textAlign = egret.HorizontalAlign.CENTER;
        this._scoreTF.size = 30;
        this._scoreTF.text = "您已经走了" + this._score + "米";
        this._scoreTF.fontFamily = "Microsoft YaHei";
        this.addChild(this._scoreTF);
        //生命
        this._lifeTF = new egret.TextField();
        this._lifeTF.x = this.stage.stageWidth * 0.05;
        this._lifeTF.y = 20;
        this._lifeTF.width = this.stage.stageWidth * 0.2;
        this._lifeTF.height = 50;
        this._lifeTF.textColor = 0xff6600;
        this._lifeTF.textAlign = egret.HorizontalAlign.LEFT;
        this._lifeTF.size = 25;
        this._lifeTF.text = "您还有" + this._lifeCount + "条命";
        this._lifeTF.fontFamily = "Microsoft YaHei";
        this.addChild(this._lifeTF);
        //单词提示器
        this._remindWordTF = new egret.TextField();
        this._remindWordTF.x = this.stage.stageWidth * 0.7;
        this._remindWordTF.y = 20;
        this._remindWordTF.width = this.stage.stageWidth * 0.28;
        this._remindWordTF.height = 50;
        this._remindWordTF.textColor = 0xff6600;
        this._remindWordTF.textAlign = egret.HorizontalAlign.LEFT;
        this._remindWordTF.size = 25;
        this._remindWordTF.text = "任务单词：";
        this._remindWordTF.fontFamily = "Microsoft YaHei";
        this.addChild(this._remindWordTF);
        this._remindExplainTF = new egret.TextField();
        this._remindExplainTF.x = this.stage.stageWidth * 0.7;
        this._remindExplainTF.y = 70;
        this._remindExplainTF.width = this.stage.stageWidth * 0.28;
        this._remindExplainTF.height = 100;
        this._remindExplainTF.textColor = 0xff3a68;
        this._remindExplainTF.textAlign = egret.HorizontalAlign.LEFT;
        this._remindExplainTF.size = 25;
        this._remindExplainTF.lineSpacing = 6;
        this._remindExplainTF.fontFamily = "Microsoft YaHei";
        this.addChild(this._remindExplainTF);
        // //倒计时提示
        // this._scendsTF = new egret.TextField();
        // this._scendsTF.x = this.stage.stageWidth*0.75;
        // this._scendsTF.y = 20;
        // this._scendsTF.width = this.stage.stageWidth*0.25;
        // this._scendsTF.height = 55;
        // this._scendsTF.fontFamily = "Microsoft YaHei"
        // this._scendsTF.textColor = 0xff6c14;
        // this._scendsTF.textAlign =  egret.HorizontalAlign.CENTER;
        // this._scendsTF.size = 50;
        // this._scendsTF.text = this._scends + "秒";
        // this.addChild(this._scendsTF);
        // //游戏计时器
        // this._gameTimer = new egret.Timer(1000, this._scends);
        // this._gameTimer.addEventListener(egret.TimerEvent.TIMER, this.gameTimerFunc, this);
        // this._gameTimer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.gameTimerCompleteFunc, this);
        // this._gameTimer.start();
        var sound = new egret.Sound();
        sound.addEventListener(egret.Event.COMPLETE, function () {
            this._backgroundChannel = sound.play(0, 0);
            this._backgroundChannel.volume = 0.7;
        }, this);
        sound.load("resource/sound/bg.mp3");
    };
    // //每秒计时
    // private gameTimerFunc () {
    // 	this._scends--;
    //     this._scendsTF.text = this._scends + "秒";
    // 	//剩5秒时播放倒计时音乐
    // 	 if (this._scends == 5) {
    //      	let sound = new egret.Sound();
    // 		sound.addEventListener(egret.Event.COMPLETE, function() {
    //     		this._countdownChannel = sound.play(0,0);
    // 		}, this);
    // 		sound.load("resource/sound/countdown.mp3");
    //     }
    // }
    //游戏结束
    Game.prototype.gameTimerCompleteFunc = function () {
        this._gameEnd = true;
        this.removeTouchEvent();
        //请求游戏结束接口
        this.gameOver();
        // if (this._countdownChannel) this._countdownChannel.stop();
        if (this._backgroundChannel)
            this._backgroundChannel.stop();
        // if (this._gameTimer) this._gameTimer.stop();
    };
    //添加触摸事件
    Game.prototype.addTouchEvent = function () {
        if (this._gameEnd == false) {
            this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBegin, this);
            this.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.touchEnd, this);
            this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMove, this);
        }
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
        //控制点超出屏幕时容错
        // if(event.localY < 0) {
        // 	this._touchMoveToY = 0;
        // }
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
        //设置箭头的贝塞尔曲线控制点
        var controlX = this._personBeginPoint.x + (this._touchMoveToX - this._personBeginPoint.x) / 2;
        var controlY = this._personBeginPoint.y + (this._touchMoveToY - this._personBeginPoint.y) / 2 - 15;
        //画箭头
        this._guideLine.graphics.lineStyle(3, 0x34b29a);
        this._guideLine.graphics.moveTo(this._personBeginPoint.x, this._personBeginPoint.y); //起点
        this._guideLine.graphics.curveTo(controlX, controlY, this._touchMoveToX, this._touchMoveToY); //控制点,终点
        this._guideLine.graphics.endFill();
        this.addChild(this._guideLine);
    };
    //触摸结束
    Game.prototype.touchEnd = function (event) {
        //清除箭头
        this._guideLine.graphics.clear();
        //动画时移除交互事件
        this.removeTouchEvent();
        //根据线的长度计算最高点 2倍
        this._pathHighX = this._personBeginPoint.x + (this._touchMoveToX - this._personBeginPoint.x) * 2;
        this._pathHighY = this._personBeginPoint.y - this._personWH - (this._personBeginPoint.y - this._touchMoveToY) * 2;
        //缓动动画
        egret.Tween.get(this).to({ factor: 1 }, 1000).call(function () {
            //动画结束之后如果未发生碰撞, 恢复对象位置 - 复活重玩
            if (this._isHit == false) {
                var firstStep = this._stepsArray[0];
                this._person.x = firstStep.x + firstStep.width / 2 - this._person.width / 2;
                this._person.y = this._personTopY;
                this._lifeCount -= 1;
                this._lifeTF.text = "您还有" + this._lifeCount + "条命";
                if (this._lifeCount < 1) {
                    this._lifeTF.text = "";
                    this.gameTimerCompleteFunc();
                }
                //掉下去的声音
                var sound_1 = new egret.Sound();
                sound_1.addEventListener(egret.Event.COMPLETE, function () {
                    var channel = sound_1.play(0, 1);
                }, this);
                sound_1.load("resource/sound/down.mp3");
                //请求接口,提交掉下去
                this.plusScore(0);
            }
            //动画结束后重新添加交互事件 (未发生碰撞)
            this.addTouchEvent();
        }, this);
        //弹跳时的声音
        var sound = new egret.Sound();
        sound.addEventListener(egret.Event.COMPLETE, function () {
            var channel = sound.play(0, 1);
            channel.volume = 0.7;
        }, this);
        sound.load("resource/sound/jump.mp3");
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
            var _isHit = _step.hitTestPoint(this._person.x + this._person.width / 2, this._person.y + this._person.height);
            // let _isHit1: boolean = _step.hitTestPoint(this._person.x + 20, this._person.y+this._person.height, true);
            // let _isHit2: boolean = _step.hitTestPoint(this._person.x+this._person.width, this._person.y+this._person.height, true);
            if (_isHit) {
                this.hitAction(index);
            }
        }
    };
    //发生碰撞
    Game.prototype.hitAction = function (hitIndex) {
        //碰撞时的声音
        // let sound = new egret.Sound();
        // sound.addEventListener(egret.Event.COMPLETE, function() {
        // 	let channel:egret.SoundChannel = sound.play(0,1);
        // }, this);
        // sound.load("resource/sound/down.mp3");
        //发生碰撞,设置Y值, 移除弹跳对象的缓动动画
        this._person.y = this._personTopY;
        egret.Tween.removeTweens(this);
        //不重置对象位置,跳跃成功,不死
        this._isHit = true;
        //要移动的距离 = 跳到的台阶的中心点 - 初始x值
        var moveLen = this._stepsArray[hitIndex].x + this._stepsArray[hitIndex].width / 2 - this._stepBeginX;
        //拿到目标台阶上的字母
        if (hitIndex > 0) {
            console.log("发生碰撞时" + this._letterTFArray.length);
            var wordTF = this._letterTFArray[hitIndex - 1];
            this.addLetter(wordTF.text);
        }
        //移动米数
        this._score += Math.round(moveLen / 100);
        this._scoreTF.text = "您已经走了" + this._score + "米";
        //增加分数
        this.plusScore(Math.round(moveLen / 100));
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
        // if(this._scends < 0){
        // 	return;
        // }
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
        //删除跳跃过的数据
        this._letterTFArray.splice(0, this._hitIndex);
        this._letterImgArray.splice(0, this._hitIndex);
        //拿到最后一个台阶的x值
        var _lastStep = this._stepsArray[this._stepsArray.length - 1];
        //新增台阶的前一个台阶的x值
        var _frontX = _lastStep.x;
        //末尾添加台阶index
        for (var i = 0; i < this._hitIndex; i++) {
            var _step = new Bitmap("step_png");
            _step.y = this._personTopY + this._personWH;
            _step.x = _frontX + _step.width + Math.random() * 300;
            _step.width = 130;
            _step.height = 30;
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
            _letterImg.width = 60;
            _letterImg.height = 60;
            _letterImg.y = _step.y - 60;
            _letterImg.x = _step.x + 35;
            this.addChild(_letterImg);
            //添加到字母图片数组
            this._letterImgArray.push(_letterImg);
        }
        this._letterArray.splice(0, this._hitIndex);
        //字母少的时候重新添加数据
        if (this._letterArray.length < 10) {
            this.getWords(2);
        }
        //移动之后重新添加交互事件
        this.addTouchEvent();
        //隔着跳 重置单词
        if (this._hitIndex > 1) {
            console.log("隔着跳了");
            this.getWords(3);
        }
    };
    Game.prototype.addLetter = function (letter) {
        var word = this._wordTF.text.replace("单词：", "");
        this._wordTF.text += letter;
        for (var i = 0; i < this._allWords.length; i++) {
            var check = this._allWords[i].replace(".", "").replace(" ", "").toLowerCase();
            this.checkWord(check, i);
        }
    };
    Game.prototype.checkWord = function (word, index) {
        if (this._wordTF.text.replace("单词：", "").replace(".", "") == word) {
            this._remindWordTF.text = "任务单词：" + this._allWords[index + 1];
            this._remindExplainTF.text = this._allWordsExplain[index + 1];
            this.removeTouchEvent();
            //增加分数
            this.plusScore(50);
            //提示吃对单词图片
            var right = new Bitmap("bingo_png");
            right.x = 520;
            right.y = 180;
            right.width = 210;
            right.height = 107;
            this.addChild(right);
            //加速时 时间稍微往后 加米数
            var timer = new egret.Timer(500, 1);
            timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, function () {
                //加速动画 300 * 5
                this.addChild(new GameSpeedMotion(this.stage.stageWidth));
                this.removeTouchEvent();
                var add = new egret.Timer(300, 1);
                add.addEventListener(egret.TimerEvent.TIMER_COMPLETE, function () {
                    //增加本地分数
                    this._score += 50;
                    this._scoreTF.text = "您已经走了" + this._score + "米";
                    this._wordTF.text = "单词：";
                }, this);
                add.start();
                var touch = new egret.Timer(1500, 1);
                touch.addEventListener(egret.TimerEvent.TIMER_COMPLETE, function () {
                    this.addTouchEvent();
                }, this);
                touch.start();
                if (right && right.parent) {
                    right.parent.removeChild(right);
                }
            }, this);
            timer.start();
        }
    };
    //接口-增加分数
    Game.prototype.plusScore = function (score) {
        var params = "?vuid=" + this._info._vuid +
            "&rands=" + this._rands +
            "&tid=" + this._tid +
            "&md5=" + score +
            "&timenum=" + this._info._timenum +
            "&activitynum=" + this._info._activitynum +
            "&isfrom=" + this._info._isfrom;
        var request = new egret.HttpRequest();
        request.responseType = egret.HttpResponseType.TEXT;
        console.log(this._info._typosTempjump + params);
        request.open(this._info._typosTempjump + params, egret.HttpMethod.GET);
        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        request.send();
        request.addEventListener(egret.Event.COMPLETE, function () {
            var result = JSON.parse(request.response);
            // alert(this._info._typosTempjump + "---"+ params + "---"+result["code"] + "---"+result["msg"]);
            console.log(result);
        }, this);
        request.addEventListener(egret.IOErrorEvent.IO_ERROR, function () {
            alert("post error : " + event);
        }, this);
    };
    //接口-减游戏次数
    Game.prototype.minusGameCount = function () {
        var params = "?vuid=" + this._info._vuid +
            "&key=" + this._info._key +
            "&timenum=" + this._info._timenum +
            "&activitynum=" + this._info._activitynum +
            "&isfrom=" + this._info._isfrom;
        // alert("减游戏次数接口 - "+this._info._getWord + params);
        var request = new egret.HttpRequest();
        request.responseType = egret.HttpResponseType.TEXT;
        request.open(this._info._downnum + params, egret.HttpMethod.GET);
        console.log(this._info._downnum + params);
        request.send();
        request.addEventListener(egret.Event.COMPLETE, function () {
            var result = JSON.parse(request.response);
            console.log(result);
            if (result["code"] == 0) {
                this._linnum = parseInt(result["data"]["linnum"]);
                this._rands = result["data"]["rands"].toString();
                this._tid = result["data"]["tid"].toString();
                //请求单词
                this.getWords(1);
            }
            else if (result["code"] == 2) {
                this._overAlert = new Alert(Alert.GamePageShare, "", "", "", 0, this.stage.stageHeight, this.stage.stageWidth);
                this._overAlert.addEventListener(AlertEvent.Share, this.shareButtonClick, this);
                this._overAlert.addEventListener(AlertEvent.Cancle, function () {
                    window.location.reload();
                }, this);
                this.addChild(this._overAlert);
            }
        }, this);
        request.addEventListener(egret.IOErrorEvent.IO_ERROR, function () {
            alert("post error : " + event);
        }, this);
    };
    //接口-游戏结束
    Game.prototype.gameOver = function () {
        var params = "?score=" + this._score +
            "&vuid=" + this._info._vuid +
            "&key=" + this._info._key +
            "&rands=" + this._rands +
            "&timenum=" + this._info._timenum +
            "&activitynum=" + this._info._activitynum +
            "&isfrom=" + this._info._isfrom;
        // alert("游戏结束接口 - "+this._info._gameover + params);
        var request = new egret.HttpRequest();
        request.responseType = egret.HttpResponseType.TEXT;
        console.log(this._info._gameover + params);
        request.open(this._info._gameover + params, egret.HttpMethod.GET);
        request.send();
        request.addEventListener(egret.Event.COMPLETE, function () {
            var result = JSON.parse(request.response);
            console.log(result);
            var highScore = result["data"]["score"];
            if (this._score > parseInt(highScore)) {
                highScore = this._score;
            }
            this._normalAlert = new Alert(Alert.GamePageScore, this._score.toString(), highScore, result["data"]["order"], result["data"]["text"], this.stage.stageHeight, this.stage.stageWidth);
            this._normalAlert.x = 250;
            this._normalAlert.y = -100;
            this._normalAlert.addEventListener(AlertEvent.Ranking, this.checkRanking, this);
            this._normalAlert.addEventListener(AlertEvent.Restart, this.restartGame, this);
            this.addChild(this._normalAlert);
        }, this);
        request.addEventListener(egret.IOErrorEvent.IO_ERROR, function () {
            alert("post error : " + event);
        }, this);
    };
    //游戏结束alert-查看排名
    Game.prototype.checkRanking = function () {
        console.log("game 查看排名");
        if (this._normalAlert && this._normalAlert.parent) {
            this._normalAlert.parent.removeChild(this._normalAlert);
        }
        // alert("查看排名 - "+this._info._rankUrl + this._info._timenum + "/activitynum/" + this._info._activitynum + "/vuid/" + this._info._vuid + "/key/" + this._info._key + "/isfrom/" + this._info._isfrom);
        window.location.href = this._info._rankUrl + this._info._timenum + "/activitynum/" + this._info._activitynum + "/vuid/" + this._info._vuid + "/key/" + this._info._key + "/isfrom/" + this._info._isfrom;
    };
    //游戏结束alert-重玩
    Game.prototype.restartGame = function () {
        console.log("game 重玩");
        this.removeChildren();
        // this._scends = 180;
        this._score = 0;
        this._lifeCount = 10;
        this._gameEnd = false;
        //重玩时清空数组
        this._stepsArray.splice(0, this._stepsArray.length);
        this._letterArray.splice(0, this._letterArray.length);
        this._letterTFArray.splice(0, this._letterTFArray.length);
        this._letterImgArray.splice(0, this._letterImgArray.length);
        this._allWords.splice(0, this._allWords.length);
        this._allWordsExplain.splice(0, this._allWordsExplain.length);
        //重新添加游戏场景
        this.createGameScene();
    };
    Game.prototype.shareButtonClick = function () {
        // this.removeChild(this._overAlert);
        //分享引导图
        var _shareGuide = new Bitmap("shareGui2_png");
        _shareGuide.touchEnabled = true;
        _shareGuide.x = 0;
        _shareGuide.y = 0;
        _shareGuide.width = this.stage.stageWidth;
        _shareGuide.height = this.stage.stageHeight;
        _shareGuide.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            this.removeChild(_shareGuide);
        }, this);
        this.addChild(_shareGuide);
    };
    return Game;
}(egret.DisplayObjectContainer));
__reflect(Game.prototype, "Game");
//# sourceMappingURL=Game.js.map