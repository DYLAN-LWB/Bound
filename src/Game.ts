class Game extends egret.DisplayObjectContainer {

	public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

	private createBitmapByName(name: string) {
        let result = new egret.Bitmap();
        let texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }

	//public
	private stageW: number;	//舞台宽度
	private stageH: number;	//舞台高度
	private totalStep:number = 5;	//台阶数量
	private stepArray = [];	//阶梯数组

	private startX:number = 200; //初始x值 (台阶中心点为准)

	private metersCount:number = 0;	//走的总米数
	private metersLabel: egret.TextField;

	private wordArray = ["a","p","p","l","e"];


	//object
	private mainObject = this.createBitmapByName("beibei_png");	//弹跳对象
	private objectWH:number = 80;	//对象宽高
	private objectPoint = new egret.Point(0,0);	//对象出发点
	private objectBeginY = 350;
	private arrow = this.createBitmapByName("ladder_png");	//指示箭头

	//touch and line
	private touchPoint = new egret.Point(0,0);	//开始触摸的点
	private guideLine:egret.Shape = new egret.Shape();	//路径引导线
	private moveToX: number;	//X坐标将要移动到的位置
	private moveToY: number;	//Y坐标将要移动到的位置
	private maxLen: number = 150;	//箭头的最大长度
	private lineLen: number;		//箭头实际长度

	//bessel
	private highX: number;	//运动到最高点的x坐标
	private highY: number;	//运动到最高点的y坐标

	//hit
	private hasHit: boolean = false;	//如果未碰撞到,恢复对象位置


    private onAddToStage(event: egret.Event) {

		this.stageW = this.stage.stageWidth;
		this.stageH = this.stage.stageHeight;

		//游戏背景
		let gameBack = new GameBackground(this.stageW, this.stageH);
		this.addChild(gameBack);

		//前一个台阶的x值
		let frontStepX = 0;
		//添加台阶, 台阶添加背景容器来控制x值
		for(var i = 0; i < this.totalStep; i++) {

			let step = this.createBitmapByName("ladder_png");
            step.width = 120;
            step.height = 25;
			step.y = this.objectBeginY + this.objectWH;
			step.x = frontStepX + step.width + 50 +  Math.random()*300;
            this.addChild(step);

			if(i == 0) {
				step.x = this.startX - step.width/2;
			}

			frontStepX = step.x;

			if(i > 0 && i < this.wordArray.length+1){
				let word  = new egret.TextField();
				word.x = step.x;
				word.y = step.y - 40;
				word.width = 120;
				word.height = 40;
				word.textColor = 0xFF0000;
				word.textAlign =  egret.HorizontalAlign.CENTER;
				word.size = 30;
				word.text = this.wordArray[i-1];
				// this.addChild(word);
			}

			this.stepArray.push(step);
		}

		//游戏对象
		this.mainObject.width = this.objectWH;
		this.mainObject.height = this.objectWH;
		this.mainObject.x = this.startX - this.mainObject.width/2;
		this.mainObject.y = this.objectBeginY;
		this.addChild(this.mainObject);

		//设置弹跳对象初始位置
		this.objectPoint.x = this.mainObject.x + this.objectWH/2;
		this.objectPoint.y = this.mainObject.y + this.objectWH;


		this.arrow = this.createBitmapByName("ladder_png");
		this.arrow.y = this.objectPoint.y;
		this.arrow.x = this.objectPoint.x;
		this.arrow.width = 0;
		this.arrow.height = 0;
		this.addChild(this.arrow);

		//添加touch事件
		this.addTouchEvent();

		//米数提示文字
		this.metersLabel = new egret.TextField();
		this.metersLabel.x = 0;
		this.metersLabel.y = 20;
		this.metersLabel.width = this.stageW;
		this.metersLabel.height = 55;
        this.metersLabel.textColor = 0xFF0000;
		this.metersLabel.textAlign =  egret.HorizontalAlign.CENTER;
        this.metersLabel.size = 30;
        this.metersLabel.text = "您已经走了" + this.metersCount + "米";
        this.addChild(this.metersLabel);

    }

	private addTouchEvent() {
		this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBegin, this);
		this.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.touchEnd, this);
		this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMove, this);
	}

	private removeTouchEvent() {
		this.stage.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBegin, this);
		this.stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.touchEnd, this);
		this.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMove, this);
	}

	private touchBegin(event: egret.TouchEvent) {

		//触摸时拿到触摸点的位置
		this.touchPoint.x = event.localX;
		this.touchPoint.y = event.localY;

		//重置
		this.hasHit = false;
	}

	private touchMove(event: egret.TouchEvent) {
	
		//清除上次画的箭头
		this.guideLine.graphics.clear();

		//初始化箭头
		this.arrow.width = 0;
		this.arrow.height = 0;
		this.arrow.rotation = 0;

		//控制点超出屏幕时容错
		if(event.localY < 0) {
			this.moveToY = 0;
			console.log("超出屏幕");
		}

		//计算触摸点移动到的坐标
		this.moveToX = this.objectPoint.x + (event.localX - this.touchPoint.x);
		this.moveToY = this.objectPoint.y + (event.localY - this.touchPoint.y);

		//勾股定理计算斜边长度
		let powX = Math.pow(this.moveToX-this.objectPoint.x,2);
		let powY = Math.pow(this.moveToY-this.objectPoint.y,2);
		this.lineLen = Math.sqrt(powX+powY);

		//长度超过限制,计算最远的点坐标
		if(this.lineLen > this.maxLen) {
			this.lineLen = this.maxLen;

			//实际直角三角形三条边长度
			let moveX = event.localX - this.touchPoint.x;
			let moveY = event.localY - this.touchPoint.y;
			let bias = Math.sqrt(moveX*moveX+moveY*moveY);
			
			//已知最长斜边,按比例计算另外两条边的长度
			let newX = this.maxLen*moveX/bias;
			let newY = this.maxLen*moveY/bias;

			//计算最长距离的点坐标
			this.moveToX = this.objectPoint.x + newX;
			this.moveToY = this.objectPoint.y + newY;
		}


		if(this.moveToX < this.objectPoint.x) {
			this.moveToX = this.objectPoint.x;
			this.moveToY = this.objectPoint.y-this.lineLen;

		}

		if(this.moveToY > this.objectPoint.y) {
			this.moveToY = this.objectPoint.y;
			this.moveToX = this.objectPoint.x+this.lineLen;

		}

		//计算角度来旋转箭头
		//cosB = a/c
		let radian =(this.moveToX-this.objectPoint.x)/(this.objectPoint.y - this.moveToY);
		//通过弧度Math.atan(radian) 计算角度 1弧度＝180°/π （≈57.3°）
		let angle = 90 - Math.atan(radian) * 180 / Math.PI;

		this.arrow.width = this.lineLen;
		this.arrow.height = 10;
		this.arrow.rotation = -angle;

		//设置箭头的贝塞尔曲线控制点
		let controlX = this.objectPoint.x + (this.moveToX - this.objectPoint.x)/2;
		let controlY = this.objectPoint.y + (this.moveToY - this.objectPoint.y)/2 - 20;

		//画箭头
 		this.guideLine.graphics.lineStyle(5,0xFF0000);
        this.guideLine.graphics.moveTo(this.objectPoint.x, this.objectPoint.y);	//起点
		this.guideLine.graphics.curveTo(controlX, controlY, this.moveToX, this.moveToY);	//控制点,终点
        this.guideLine.graphics.endFill();
        this.addChild(this.guideLine);

	}

	private historyArrow = this.createBitmapByName("ladder_png");

	private touchEnd(event: egret.TouchEvent) {

		//清除箭头
		this.guideLine.graphics.clear();

		//初始化箭头
		this.arrow.width = 0;
		this.arrow.height = 0;
		this.arrow.rotation = 0;

		//创建历史轨迹箭头
		let radian =(this.moveToX-this.objectPoint.x)/(this.objectPoint.y - this.moveToY);
		let angle = 90 - Math.atan(radian) * 180 / Math.PI;
		this.historyArrow.y = this.objectPoint.y;
		this.historyArrow.x = this.objectPoint.x;
		this.historyArrow.width = this.lineLen;
		this.historyArrow.height = 10;
		this.historyArrow.rotation = -angle;
		this.historyArrow.alpha = 0.2;
		this.addChild(this.historyArrow);

		//动画时移除交互事件
		this.removeTouchEvent();

		//根据线的长度计算最高点 2倍
		this.highX = this.objectPoint.x + (this.moveToX - this.objectPoint.x)*4;
		this.highY = this.objectPoint.y - this.objectWH - (this.objectPoint.y - this.moveToY)*4;

		//缓动动画
		egret.Tween.get(this).to({factor: 1}, 1000).call(function() {

			//动画结束之后如果未发生碰撞, 恢复对象位置 - 复活重玩
			if(this.hasHit == false) {
				let firstStep = this.stepArray[0];
				this.mainObject.x = firstStep.x + firstStep.width/2 - this.mainObject.width/2;
				this.mainObject.y = this.objectBeginY;
			}
			//动画结束后重新添加交互事件 (未发生碰撞)
			this.addTouchEvent();
		}, this);
	}

	public get factor():number {
        return 0;
    }

    public set factor(value:number) {
		this.mainObject.x = (1 - value) * (1 - value) * this.objectPoint.x + 2 * value * (1 - value) * this.highX + value * value * (this.highX*2 - this.objectPoint.x);
		this.mainObject.y = (1 - value) * (1 - value) * (this.objectPoint.y - this.objectWH) + 2 * value * (1 - value) * (this.highY-300) + value * value * (this.stageH- this.objectWH);

		this.observeHit();
	}

	private newCount:number;

	private observeHit() {

		for(var index = 0; index < this.stepArray.length; index++) {

			var step = this.stepArray[index];
			var isHit: boolean = step.hitTestPoint(this.mainObject.x+this.mainObject.width/2, this.mainObject.y+this.mainObject.height, true);

			if(isHit) {
				this.hitAction(index);
				// this.speedUp();
				//
				let speed = new SpeedMotion();
				this.addChild(speed);
			}
		}	
	}

	private hitAction(hitIndex:number) {
		//清除历史箭头
		this.removeChild(this.historyArrow);


		//发生碰撞,设置Y值, 移除缓动动画
		this.mainObject.y = this.objectBeginY;
		egret.Tween.removeTweens(this);

		//不重置对象位置,跳跃成功,不死
		this.hasHit = true;

		//要移动的距离 = 跳到的台阶的中心点 - 初始x值
		let moveLen = this.stepArray[hitIndex].x + this.stepArray[hitIndex].width/2 - this.startX;

		//移动米数
		this.metersCount += Math.round(moveLen/100);
		this.metersLabel.text = "您已经走了" + this.metersCount + "米";

		//遍历数组 改变x值
		for(var j = 0; j < this.stepArray.length; j++ ) {
			var ste = this.stepArray[j];
			egret.Tween.get(ste).to({x:ste.x - moveLen}, 300);
		}

		//改变对象x值
		egret.Tween.get(this.mainObject).to({x:this.startX - this.mainObject.width/2}, 300);

		//删除0到i(脚下之前)的台阶 
		for(var del = 0; del < hitIndex; del++ ) {
			this.removeChild(this.stepArray[del]);
		}
		//删除跳跃过的数据
		this.stepArray.splice(0, hitIndex);

		this.newCount = hitIndex;

		//台阶动画结束后再执行
		var timer: egret.Timer = new egret.Timer(310, 1);
		timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.tweenComplete, this);
		timer.start();
	}

	private tweenComplete(){
		//拿到最后一个台阶的x值
		let endStep = this.stepArray[this.stepArray.length - 1];

		let frontX = endStep.x;
		//末尾添加台阶index
		for(var addCount = 0; addCount < this.newCount; addCount++ ) {
			let step = this.createBitmapByName("ladder_png");
			step.y = this.objectBeginY + this.objectWH;
			step.x = frontX + step.width + 50 +  Math.random()*300;
			step.width = 120;
			step.height = 25;
			this.addChild(step);

			frontX = step.x;

			//添加新增的台阶
			this.stepArray.push(step);
		}

		//移动之后重新添加交互事件
		this.addTouchEvent();
	}


}




