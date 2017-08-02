class Game extends egret.DisplayObjectContainer {

	//USER
    private _info = new Info(); //公用信息表
	private _linnum: number;	//剩余挑战次数
	private _rands: string;		//随机字符串,提交分数时加	
	private _tid: string;

	//public
	private _totalStepCount = 5;			//台阶数量
	private _lifeCount = 555;					//x条命
	private _stepBeginX = 200; 				//初始x值 (台阶中心点为准)
	private _score = 0;						//走的总米数
	private _scoreTF: egret.TextField;		//米数文字
	// private _scends = 180;					//游戏默认180秒
	// private _scendsTF: egret.TextField;		//倒计时文字
	// private _gameTimer: egret.Timer;		//游戏倒计时计时器
	// private _countdownChannel: egret.SoundChannel;	//倒计时结束的声音
	private _hitIndex: number;				//碰撞到的台阶,在当前台阶数组的index
	private _backgroundChannel: egret.SoundChannel;	//游戏背景音乐
	private _wordTF: egret.TextField;		//提示完成的单词

	private _stepsArray = [];			//阶梯数组
	private _letterArray = [];			//字母数组只在每次新增台阶之后删除对象数量的字母
	private _letterTFArray = []; 		//字母textfield
	private _letterImgArray = [];		//字母图片数组
	private _allWords = [];				//所有单词数组,用来检测吃到的单词对错

	private _normalAlert: Alert;	//弹窗提示

	private _person = new Bitmap("beibei_png");			//弹跳对象
	private _personBeginPoint = new egret.Point(0,0);	//对象出发点
	private _personTopY = 350;		//对象的Y值,控制弹跳对象和台阶
	private _personWH = 110;			//对象宽高

	private _guideLine = new egret.Shape();				//线条引导
	private _guideArrow = new Bitmap("ladder_png");		//箭头引导
	private _historyArrow = new Bitmap("ladder_png");	//上次箭头引导轨迹

	private _touchBeginPoint = new egret.Point(0,0);	//开始触摸的点
	private _touchMoveToX: number;						//X坐标将要移动到的位置
	private _touchMoveToY: number;						//Y坐标将要移动到的位置
	private _guideMaxLength = 150;						//箭头的最大长度
	private _guideTruthLength: number;					//箭头实际长度

	private _pathHighX: number;		//运动到最高点的x坐标
	private _pathHighY: number;		//运动到最高点的y坐标

	private _isHit: boolean = false;	//如果未碰撞到,恢复对象位置


	public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.createGameScene, this);
    }

    private createGameScene() {
		//游戏背景
		let _gameBackground = new GameBackground(this.stage.stageWidth, this.stage.stageHeight);
		this.addChild(_gameBackground);

		this._info._vuid = localStorage.getItem("vuid").replace(/"/g,"");
        this._info._key = localStorage.getItem("key").replace(/"/g,"");
		this._info._isfrom = localStorage.getItem("isfrom").replace(/"/g,"");
		this._info._timenum = localStorage.getItem("timenum").replace(/"/g,"");
		this._info._activitynum = localStorage.getItem("activitynum").replace(/"/g,"");

		//减游戏次数
		this.minusGameCount();
    }

	//接口-请求单词, 只在初次添加UI
	private getWords(init:boolean) {
		// this._letterArray = ["g","o","o","d","a","p","p","l","e","j","k","l","m","n","o"];

		let params = "?vuid=" + this._info._vuid + 
					 "&key=" + this._info._key +
					 "&rands=" + this._rands + 
					 "&isfrom=" + this._info._isfrom;
		let request = new egret.HttpRequest();
        request.responseType = egret.HttpResponseType.TEXT;
        request.open(this._info._getWord + params, egret.HttpMethod.GET);
        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        request.send();
		request.addEventListener(egret.Event.COMPLETE, function() {
			console.log(JSON.parse(request.response));
			let result = JSON.parse(request.response);
	        if (result["code"] == 0) {
				Array.prototype.push.apply(this._allWords, result["data"]); //将请求到的单词添加到大数组
				let wordsString = result["data"].join().replace(/,/g,""); //将单词数组转为字符串,并且去掉所有逗号
				let newLetters = wordsString.split("");	//将字母字符串转为数组
				Array.prototype.push.apply(this._letterArray, newLetters); //追加到字母数组
				
				//接口请求成功添加UI
				if (init) {
					this.setupSteps();	//添加台阶
					this.setupPerson();	//添加游戏人物
					this.setupReminder();	//添加提示信息,其他
					this.addTouchEvent();	//添加touch事件
				}

			} else {
				alert("请求出错-"+result["msg"]);
			}
		}, this);
	}

	//设置台阶
	private setupSteps() {

		//第一个台阶特殊 手动创建
		let firstStep = new Bitmap("ladder_png");
		firstStep.width = 120;
		firstStep.height = 25;
		firstStep.y = this._personTopY + this._personWH;
		firstStep.x = this._stepBeginX - firstStep.width/2;
		this.addChild(firstStep);

		//添加到台阶数组
		this._stepsArray.push(firstStep);

		//前一个台阶的x值
		let _frontStepX = firstStep.x;

		//添加台阶
		for(let i = 0; i < this._totalStepCount; i++) {

			//创建台阶
			let _step = new Bitmap("ladder_png");
            _step.width = 120;
            _step.height = 25;
			_step.y = this._personTopY + this._personWH;
			_step.x = _frontStepX + _step.width + 50 +  Math.random()*300;
            this.addChild(_step);

			//添加到台阶数组
			this._stepsArray.push(_step);

			//重置前一个台阶的x值
			_frontStepX = _step.x;
			
			//添加字母文字,方便碰撞时拿到字母
			let _letterTF  = new egret.TextField();
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
			let _letterImg = new Bitmap("letter_json." + _letterTF.text);
       		_letterImg.width = 60;
            _letterImg.height = 60;
			_letterImg.y = _step.y - 60;
			_letterImg.x = _step.x + 30;
            this.addChild(_letterImg);

			//添加到字母图片数组
			this._letterImgArray.push(_letterImg);
		}
		//每次添加台阶都要删除对应数量的字母
		this._letterArray.splice(0, this._totalStepCount);
	}

	//设置对象
	private setupPerson() {
		this._person.width = this._personWH;
		this._person.height = this._personWH;
		this._person.x = this._stepBeginX - this._person.width/2;
		this._person.y = this._personTopY;
		this.addChild(this._person);

		//设置弹跳对象初始坐标
		this._personBeginPoint.x = this._person.x + this._personWH/2;
		this._personBeginPoint.y = this._person.y + this._personWH;


		//指示箭头提示
		this._guideArrow = new Bitmap("ladder_png");
		this._guideArrow.y = this._personBeginPoint.y;
		this._guideArrow.x = this._personBeginPoint.x;
		this._guideArrow.width = 0;
		this._guideArrow.height = 0;
		// this.addChild(this._guideArrow);
	}

	//设置提示文字,分数,倒计时
	private setupReminder() {
		//分数提示
		this._scoreTF = new egret.TextField();
		this._scoreTF.x = this.stage.stageWidth*0.25;
		this._scoreTF.y = 20;
		this._scoreTF.width = this.stage.stageWidth*0.5;
		this._scoreTF.height = 55;
        this._scoreTF.textColor = 0xFF0000;
		this._scoreTF.textAlign =  egret.HorizontalAlign.CENTER;
        this._scoreTF.size = 30;
        this._scoreTF.text = "您已经走了" + this._score + "米";
        this.addChild(this._scoreTF);

		//单词提示
		this._wordTF = new egret.TextField();
		this._wordTF.x = this.stage.stageWidth*0.25;
		this._wordTF.y = 100;
		this._wordTF.width = this.stage.stageWidth*0.5;
		this._wordTF.height = 55;
        this._wordTF.textColor = 0xFFFFFF;
		this._wordTF.textAlign =  egret.HorizontalAlign.CENTER;
        this._wordTF.size = 50;
        this._wordTF.text = "";
        this.addChild(this._wordTF);

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

		let sound = new egret.Sound();
		sound.addEventListener(egret.Event.COMPLETE, function() {
			this._backgroundChannel = sound.play(0,0);
			this._backgroundChannel.volume = 0.7;
		}, this);
		sound.load("resource/sound/bg.mp3");
	}

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
	private gameTimerCompleteFunc () {

		this.removeTouchEvent();

		//请求游戏结束接口
		this.gameOver();

        // if (this._countdownChannel) this._countdownChannel.stop();
		if (this._backgroundChannel) this._backgroundChannel.stop();
		// if (this._gameTimer) this._gameTimer.stop();
	}

	//添加触摸事件
	private addTouchEvent() {
		this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBegin, this);
		this.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.touchEnd, this);
		this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMove, this);
	}

	//移除触摸事件
	private removeTouchEvent() {
		this.stage.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBegin, this);
		this.stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.touchEnd, this);
		this.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMove, this);
	}

	//开始触摸
	private touchBegin(event: egret.TouchEvent) {

		//触摸时拿到触摸点的位置
		this._touchBeginPoint.x = event.localX;
		this._touchBeginPoint.y = event.localY;

		//重置
		this._isHit = false;
	}

	//触摸点移动
	private touchMove(event: egret.TouchEvent) {
	
		//清除上次画的箭头
		this._guideLine.graphics.clear();

		//初始化箭头
		this._guideArrow.width = 0;
		this._guideArrow.height = 0;
		this._guideArrow.rotation = 0;

		//控制点超出屏幕时容错
		if(event.localY < 0) {
			this._touchMoveToY = 0;
		}

		//计算触摸点移动到的坐标
		this._touchMoveToX = this._personBeginPoint.x + (event.localX - this._touchBeginPoint.x);
		this._touchMoveToY = this._personBeginPoint.y + (event.localY - this._touchBeginPoint.y);

		//勾股定理计算斜边长度
		let powX = Math.pow(this._touchMoveToX-this._personBeginPoint.x,2);
		let powY = Math.pow(this._touchMoveToY-this._personBeginPoint.y,2);
		this._guideTruthLength = Math.sqrt(powX+powY);

		//长度超过限制,计算最远的点坐标
		if(this._guideTruthLength > this._guideMaxLength) {
			this._guideTruthLength = this._guideMaxLength;

			//实际直角三角形三条边长度
			let moveX = event.localX - this._touchBeginPoint.x;
			let moveY = event.localY - this._touchBeginPoint.y;
			let bias = Math.sqrt(moveX*moveX+moveY*moveY);
			
			//已知最长斜边,按比例计算另外两条边的长度
			let newX = this._guideMaxLength*moveX/bias;
			let newY = this._guideMaxLength*moveY/bias;

			//计算最长距离的点坐标
			this._touchMoveToX = this._personBeginPoint.x + newX;
			this._touchMoveToY = this._personBeginPoint.y + newY;
		}

		if(this._touchMoveToX < this._personBeginPoint.x) {
			this._touchMoveToX = this._personBeginPoint.x;
			this._touchMoveToY = this._personBeginPoint.y-this._guideTruthLength;
		}

		if(this._touchMoveToY > this._personBeginPoint.y) {
			this._touchMoveToY = this._personBeginPoint.y;
			this._touchMoveToX = this._personBeginPoint.x+this._guideTruthLength;
		}

		//计算角度来旋转箭头
		//cosB = a/c
		let radian =(this._touchMoveToX-this._personBeginPoint.x)/(this._personBeginPoint.y - this._touchMoveToY);
		//通过弧度Math.atan(radian) 计算角度 1弧度＝180°/π （≈57.3°）
		let angle = 90 - Math.atan(radian) * 180 / Math.PI;

		this._guideArrow.width = this._guideTruthLength;
		this._guideArrow.height = 10;
		this._guideArrow.rotation = -angle;

		//设置箭头的贝塞尔曲线控制点
		let controlX = this._personBeginPoint.x + (this._touchMoveToX - this._personBeginPoint.x)/2;
		let controlY = this._personBeginPoint.y + (this._touchMoveToY - this._personBeginPoint.y)/2 - 10;

		//画箭头
 		this._guideLine.graphics.lineStyle(2,0x000000);
        this._guideLine.graphics.moveTo(this._personBeginPoint.x, this._personBeginPoint.y);	//起点
		this._guideLine.graphics.curveTo(controlX, controlY, this._touchMoveToX, this._touchMoveToY);	//控制点,终点
        this._guideLine.graphics.endFill();
		this._guideLine.alpha = 0.2;
        this.addChild(this._guideLine);
	}

	//触摸结束
	private touchEnd(event: egret.TouchEvent) {

		//清除箭头
		this._guideLine.graphics.clear();

		//初始化箭头
		this._guideArrow.width = 0;
		this._guideArrow.height = 0;
		this._guideArrow.rotation = 0;

		//创建历史轨迹箭头
		let radian =(this._touchMoveToX-this._personBeginPoint.x)/(this._personBeginPoint.y - this._touchMoveToY);
		let angle = 90 - Math.atan(radian) * 180 / Math.PI;
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
		this._pathHighX = this._personBeginPoint.x + (this._touchMoveToX - this._personBeginPoint.x)*4;
		this._pathHighY = this._personBeginPoint.y - this._personWH - (this._personBeginPoint.y - this._touchMoveToY)*4;

		//缓动动画
		egret.Tween.get(this).to({factor: 1}, 1000).call(function() {

			//动画结束之后如果未发生碰撞, 恢复对象位置 - 复活重玩
			if(this._isHit == false) {
				let firstStep = this._stepsArray[0];
				this._person.x = firstStep.x + firstStep.width/2 - this._person.width/2;
				this._person.y = this._personTopY;

				this._lifeCount -= 1;

				if(this._lifeCount == 0) {
					this.gameTimerCompleteFunc();
				}

				//掉下去的声音
				let sound = new egret.Sound();
				sound.addEventListener(egret.Event.COMPLETE, function() {
					let channel:egret.SoundChannel = sound.play(0,1);
				}, this);
				sound.load("resource/sound/down.mp3");

			}
			//动画结束后重新添加交互事件 (未发生碰撞)
			this.addTouchEvent();
		}, this);

		//弹跳时的声音
		let sound = new egret.Sound();
		sound.addEventListener(egret.Event.COMPLETE, function() {
			let channel:egret.SoundChannel = sound.play(0,1);
			channel.volume = 0.7;
		}, this);
		sound.load("resource/sound/jump.mp3");
	}

	//二次贝塞尔曲线的缓动动画实现方式
	public get factor():number {
        return 0;
    }
    public set factor(value:number) {
		this._person.x = (1 - value) * (1 - value) * this._personBeginPoint.x + 2 * value * (1 - value) * this._pathHighX + value * value * (this._pathHighX*2 - this._personBeginPoint.x);
		this._person.y = (1 - value) * (1 - value) * (this._personBeginPoint.y - this._personWH) + 2 * value * (1 - value) * (this._pathHighY-300) + value * value * (this.stage.stageHeight- this._personWH);

		//动画过程中检测碰撞
		this.checkHit();
	}

	//碰撞检测
	private checkHit() {

		for(let index = 0; index < this._stepsArray.length; index++) {

			let _step = this._stepsArray[index];
			let _isHit: boolean = _step.hitTestPoint(this._person.x+this._person.width/2, this._person.y+this._person.height, true);

			if(_isHit) {
				this.hitAction(index);
			} 
		}	
	}

	//发生碰撞
	private hitAction(hitIndex:number) {

		//碰撞时的声音
		// let sound = new egret.Sound();
		// sound.addEventListener(egret.Event.COMPLETE, function() {
		// 	let channel:egret.SoundChannel = sound.play(0,1);
		// }, this);
		// sound.load("resource/sound/down.mp3");

		//清除历史箭头
		if(this._historyArrow && this._historyArrow.parent) {
			this._historyArrow.parent.removeChild(this._historyArrow)
		};

		//发生碰撞,设置Y值, 移除弹跳对象的缓动动画
		this._person.y = this._personTopY;
		egret.Tween.removeTweens(this);

		//不重置对象位置,跳跃成功,不死
		this._isHit = true;

		//要移动的距离 = 跳到的台阶的中心点 - 初始x值
		let moveLen = this._stepsArray[hitIndex].x + this._stepsArray[hitIndex].width/2 - this._stepBeginX;

		//拿到目标台阶上的字母
		if(hitIndex > 0) {
			let wordTF= this._letterTFArray[hitIndex-1];
			this.addLetter(wordTF.text);
		}

		//移动米数
		this._score += Math.round(moveLen/100);
		this._scoreTF.text = "您已经走了" + this._score + "米";

		//增加分数
		this.plusScore(Math.round(moveLen/100));

		//遍历数组 改变台阶x值
		for(let j = 0; j < this._stepsArray.length; j++ ) {
			var ste = this._stepsArray[j];
			egret.Tween.get(ste).to({x:ste.x - moveLen}, 300);
		}
		//遍历数组 改变字母x值
		for(let z = 0; z < this._letterTFArray.length; z++ ) {
			var word = this._letterTFArray[z];
			egret.Tween.get(word).to({x:word.x - moveLen}, 300);

			var wordImg = this._letterImgArray[z];
			egret.Tween.get(wordImg).to({x:wordImg.x - moveLen}, 300);
		}

		//改变弹跳对象x值
		egret.Tween.get(this._person).to({x:this._stepBeginX - this._person.width/2}, 300);

		this._hitIndex = hitIndex;

		//台阶动画结束后再执行
		let timer: egret.Timer = new egret.Timer(310, 1);
		timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.stepTweenComplete, this);
		timer.start();
	}

	//台阶,字母移动动画结束
	private stepTweenComplete(){

		// if(this._scends < 0){
		// 	return;
		// }
		//删除0到i(脚下之前)的台阶 
		for(let i = 0; i < this._hitIndex; i++ ) {
			if(this._stepsArray[i] && this._stepsArray[i].parent) {
				this._stepsArray[i].parent.removeChild(this._stepsArray[i])
			};	
		}
		//删除跳跃过的数据
		this._stepsArray.splice(0, this._hitIndex);

		//删除0到i的字母
		for(let i = 0; i < this._hitIndex; i++ ) {
			if(this._letterTFArray[i] && this._letterTFArray[i].parent) {
				this._letterTFArray[i].parent.removeChild(this._letterTFArray[i]);
				this._letterImgArray[i].parent.removeChild(this._letterImgArray[i]);
			};
		}

		console.log("this._hitIndex = " + this._hitIndex);
		//删除跳跃过的数据
		this._letterTFArray.splice(0, this._hitIndex);
		this._letterImgArray.splice(0, this._hitIndex);


		//拿到最后一个台阶的x值
		let _lastStep = this._stepsArray[this._stepsArray.length - 1];

		//新增台阶的前一个台阶的x值
		let _frontX = _lastStep.x;
		//末尾添加台阶index
		for(let i = 0; i < this._hitIndex; i++ ) {
			let _step = new Bitmap("ladder_png");
			_step.y = this._personTopY + this._personWH;
			_step.x = _frontX + _step.width +  Math.random()*300;
			_step.width = 120;
			_step.height = 25;
			this.addChild(_step);

			//重置前一个台阶的x值
			_frontX = _step.x;

			//添加新增的台阶
			this._stepsArray.push(_step);

			//添加字母文字,方便碰撞时拿到字母
			let _letterTF  = new egret.TextField();
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
			let _letterImg = new Bitmap("letter_json." + _letterTF.text);
       		_letterImg.width = 60;
            _letterImg.height = 60;
			_letterImg.y = _step.y - 60;
			_letterImg.x = _step.x + 30;
            this.addChild(_letterImg);

			//添加到字母图片数组
			this._letterImgArray.push(_letterImg);
		}

		this._letterArray.splice(0, this._hitIndex);

		//移动之后重新添加交互事件
		this.addTouchEvent();
	}

	private addLetter(letter:string) {

		this._wordTF.text += letter;

		for(let i = 0; i < this._allWords.length; i++) {
			this.checkWord(this._allWords[i]);
		}
	}

	private checkWord(word: string) {

		if(this._wordTF.text == word){
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

			//请求单词读音
			let request = new egret.HttpRequest();
			request.responseType = egret.HttpResponseType.TEXT;
			request.open("http://www.iciba.com/index.php?a=getWordMean&c=search&word=" + "apple", egret.HttpMethod.GET);
			request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			request.send();
			request.addEventListener(egret.Event.COMPLETE, function() {
				console.log(JSON.parse(request.response));
				let result = JSON.parse(request.response);
				if(result["baesInfo"]["symbols"].length>0) {
					let voiceUrl = result["baesInfo"]["symbols"][0]["ph_am_mp3"]
					let sound = new egret.Sound();
					sound.addEventListener(egret.Event.COMPLETE, function() {
						let channel:egret.SoundChannel = sound.play(0,1);
					}, this);
					sound.load(voiceUrl);
				}  
			}, this);

			//加速时 时间稍微往后 加米数
			let timer: egret.Timer = new egret.Timer(500, 1);
			timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE,function() {
						
				//加速动画
				this.addChild(new SpeedMotion());

				this.addTouchEvent();

				//增加本地分数
				this._score += 50;
				this._scoreTF.text = "您已经走了" + this._score + "米";
				this._wordTF.text = "";

				if(right && right.parent) {
					right.parent.removeChild(right);
				}

			},this);
			timer.start();
		}
	}

	//接口-增加分数
	private plusScore(score: number) {
		let params = "?vuid=" + this._info._vuid + 
					 "&rands=" + this._rands + 
					 "&tid=" + this._tid + 
					 "&md5=" + score + 
					 "&timenum=" + this._info._timenum + 
					 "&activitynum=" + this._info._activitynum + 
					 "&isfrom=" + this._info._isfrom;
		let request = new egret.HttpRequest();
        request.responseType = egret.HttpResponseType.TEXT;
        request.open(this._info._typosTempjump, egret.HttpMethod.POST);
        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        request.send(params);
		request.addEventListener(egret.Event.COMPLETE, function() {
			console.log(JSON.parse(request.response));
		}, this);
	}

	//接口-减游戏次数
	private minusGameCount() {
		let params = "?vuid=" + this._info._vuid +
					 "&key=" + this._info._key +
					 "&timenum=" + this._info._timenum +
					 "&activitynum=" + this._info._activitynum + 
					 "&isfrom=" + this._info._isfrom;
        let request = new egret.HttpRequest();
        request.responseType = egret.HttpResponseType.TEXT;
        request.open(this._info._downnum + params, egret.HttpMethod.GET);
		console.log(this._info._downnum + params);
        request.send();
        request.addEventListener(egret.Event.COMPLETE, function() {
			console.log(JSON.parse(request.response));
			let result = JSON.parse(request.response);
            if (result["code"] == 0) {
				this._linnum = parseInt(result["data"]["linnum"]);
				this._rands = parseInt(result["data"]["rands"]);
				this._tid = parseInt(result["data"]["tid"]);

				//请求单词
				this.getWords(true);
			} else {
				alert("请求出错-"+result["msg"]);
			}
		}, this);
	}

	//接口-游戏结束
    private gameOver() {
        var params = "?score=" + this._score + 
					 "&vuid=" + this._info._vuid +
					 "&key=" + this._info._key + 
					 "&rands=" + this._rands + 
					 "&timenum=" + this._info._timenum + 
					 "&activitynum=" + this._info._activitynum + 
					 "&isfrom=" + this._info._isfrom;
        var request = new egret.HttpRequest();
        request.responseType = egret.HttpResponseType.TEXT;
        //将参数拼接到url
        console.log(this._info._gameover + params);
        request.open(this._info._gameover + params, egret.HttpMethod.GET);
        request.send();
		request.addEventListener(egret.Event.COMPLETE, function() {

			let result = JSON.parse(request.response);
			this._normalAlert = new Alert(Alert.GamePageScore, this._score.toString(), result["data"]["score"],result["data"]["order"], result["data"]["text"],this.stage.stageHeight);
			this._normalAlert.x = 250;
			this._normalAlert.y = -100;
			this._normalAlert.addEventListener(AlertEvent.Ranking, this.checkRanking, this);
			this._normalAlert.addEventListener(AlertEvent.Restart, this.restartGame, this);
			this.addChild(this._normalAlert);

		}, this);
        request.addEventListener(egret.IOErrorEvent.IO_ERROR, function() {
			
		}, this);
    }

	//游戏结束alert-查看排名
	private checkRanking() {
		console.log("game 查看排名");

		if(this._normalAlert && this._normalAlert.parent) {
			this._normalAlert.parent.removeChild(this._normalAlert);
		} 

        window.location.href = "https://www.beisu100.com/beisuapp/gamerank/rank/timenum/" + this._info._timenum + "/activitynum/" + this._info._activitynum + "/vuid/" + this._info._vuid + "/key/" + this._info._key + "/isfrom/" + this._info._isfrom;
    }

	//游戏结束alert-重玩
    private restartGame() {

		console.log("game 重玩");
        this.removeChildren();
        // this._scends = 180;
        this._score = 0;

		//重玩时清空数组
		this._stepsArray.splice(0, this._stepsArray.length);
		this._letterArray.splice(0, this._letterArray.length);
		this._letterTFArray.splice(0, this._letterTFArray.length);
		this._letterImgArray.splice(0, this._letterImgArray.length);
		this._allWords.splice(0, this._allWords.length);

		//重新添加游戏场景
		this.createGameScene();
    }
}
