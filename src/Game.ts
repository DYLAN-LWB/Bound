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

	private stepArray = [];	//阶梯数组

	private startX:number = 200; //初始x值 (台阶中心点为准)

	//object
	private mainObject = this.createBitmapByName("beibei_png");	//弹跳对象
	private objectWH:number = 50;	//对象宽高
	private objectPoint = new egret.Point(0,0);	//对象出发点
	private objectBeginY = 300;

	//touch and line
	private touchPoint = new egret.Point(0,0);	//开始触摸的点
	private lineMaxW: number; //引导线最高长度
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
		
		//舞台背景
		let background = new egret.Sprite;
        background.graphics.beginFill(0x528B8B,1);
        background.graphics.drawRect(0,0,this.stageW,this.stageH);
        background.graphics.endFill();
        this.addChild(background);

		//添加台阶
		for(var i = 0; i < 7; i++) {
			let step = this.createBitmapByName("ladder_png");
			step.y = this.objectBeginY + this.objectWH;
			step.x = Math.random()*100 + 200*i + 100;
            step.width = 100;
            step.height = 20;
            this.addChild(step);

			if(i == 0) {
				step.x = this.startX - step.width/2;
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

		//添加touch事件
		this.addTouchEvent();
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

		//计算触摸点移动到的坐标
		this.moveToX = this.objectPoint.x + (event.localX - this.touchPoint.x);
		this.moveToY = this.objectPoint.y + (event.localY - this.touchPoint.y);

		//勾股定理计算斜边长度
		let powX = Math.pow(this.moveToX-this.objectPoint.x,2)
		let powY = Math.pow(this.moveToY-this.objectPoint.y,2)
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

		//设置箭头的贝塞尔曲线控制点
		let controlX = this.objectPoint.x + (this.moveToX - this.objectPoint.x)/2;
		let controlY = this.objectPoint.y + (this.moveToY - this.objectPoint.y)/2;

		//画箭头
 		this.guideLine.graphics.lineStyle(5,0xFFFFFF);
        this.guideLine.graphics.moveTo(this.objectPoint.x, this.objectPoint.y);	//起点
		this.guideLine.graphics.curveTo(controlX, controlY, this.moveToX, this.moveToY);	//控制点,终点
        this.guideLine.graphics.endFill();
        this.addChild(this.guideLine);
	}

	private touchEnd(event: egret.TouchEvent) {

		//清楚箭头
		this.guideLine.graphics.clear();

		//动画时移除交互事件
		this.removeTouchEvent();

		//根据线的长度计算最高点 2倍
		this.highX = this.objectPoint.x + (this.moveToX - this.objectPoint.x)*3;
		this.highY = this.objectPoint.y - this.objectWH - (this.objectPoint.y - this.moveToY)*3;

		//控制点超出屏幕时容错
		if(this.highY < 0) {
			this.highY = 0;
		}

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

		for(var index = 0; index < this.stepArray.length; index++) {

			var step = this.stepArray[index];
			var isHit: boolean = step.hitTestPoint(this.mainObject.x+this.mainObject.width/2, this.mainObject.y+this.mainObject.height, true);
			if(isHit) {
				console.log("isHit");

				//发生碰撞,移除缓动动画
				egret.Tween.removeTweens(this);

				//不重置对象位置
				this.hasHit = true;

				//要移动的距离 = 跳到的台阶的中心点 - 初始x值
				let moveLen = this.stepArray[index].x + this.stepArray[index].width/2 - this.startX;

				//遍历数组 改变x值
				for(var j = 0; j < this.stepArray.length; j++ ) {
					var ste = this.stepArray[j];
					egret.Tween.get(ste).to({x:ste.x - moveLen}, 300);
				}

				//改变对象x值
				egret.Tween.get(this.mainObject).to({x:this.startX - this.mainObject.width/2}, 300);


				//删除0到i(脚下之前)的台阶 
				for(var del = 0; del < index; del++ ) {
					this.removeChild(this.stepArray[del]);
				}
				this.stepArray.splice(0, index);
				

				console.log(this.stepArray.length);
				//拿到最后一个台阶的x值
				let lastStep = this.stepArray[this.stepArray.length - 1];
				//末尾添加台阶
				for(var last = 0; last < index; last++ ) {
					let step = this.createBitmapByName("ladder_png");
					step.y = this.objectBeginY + this.objectWH;
					step.x = Math.random()*100 + 200*last +lastStep.x - 50;
					step.width = 100;
					step.height = 20;
					this.addChild(step);

					this.stepArray.push(step);
				}

				//移动之后重新添加交互事件
				this.addTouchEvent();
			}
		}
	}







}




