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

	private stageW: number;	//舞台宽度
	private stageH: number;	//舞台高度

	
	private mainObject = this.createBitmapByName("egret_icon_png");
	private objectPoint = new egret.Point(0,0);	//出发点
	private objectWH:number = 50;

	private touchPoint = new egret.Point(0,0);
	private lineMaxW: number; //引导线最高长度

    private onAddToStage(event: egret.Event) {

		this.stageW = this.stage.stageWidth;
		this.stageH = this.stage.stageHeight;
		
		//舞台背景图片
		let stageBackground = this.createBitmapByName("testbg_png");
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
		this.objectPoint.x = this.mainObject.x + this.objectWH/2;
		this.objectPoint.y = this.mainObject.y + this.objectWH;

		//添加touch事件
		this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBegin, this);
		this.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.touchEnd, this);
    }

	private touchBegin(event: egret.TouchEvent) {

		this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMove, this);

		//触摸时拿到触摸点的位置
		this.touchPoint.x = event.localX;
		this.touchPoint.y = event.localY;
	}

	private guideLine:egret.Shape = new egret.Shape();	//方向引导线
	private moveToX: number;	//X轴将要移动到的位置
	private moveToY: number;	//Y轴将要移动到的位置
	private maxLen: number = 500;

	private touchMove(event: egret.TouchEvent) {
	
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
		let controlX = this.objectPoint.x + (this.moveToX - this.objectPoint.x)/2;
		let controlY = this.objectPoint.y + (this.moveToY - this.objectPoint.y)/2;

		//画贝塞尔曲线
 		this.guideLine.graphics.lineStyle(5,0x00ff00);
        this.guideLine.graphics.moveTo(this.objectPoint.x, this.objectPoint.y);	//起点
		this.guideLine.graphics.curveTo(controlX, controlY-15, this.moveToX, this.moveToY);	//控制点,终点
		// this.guideLine.graphics.lineTo(this.moveToX, this.moveToY);	//控制点,终点

        this.guideLine.graphics.endFill();
        this.addChild(this.guideLine);
	}

	private speedX: number;	//左右移动的速度
	private speedY: number;	//上下移动的速度
	private speedTime:number = 2;

	private touchEnd(event: egret.TouchEvent) {

		this.guideLine.graphics.clear();
		this.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMove, this);

		//对象沿曲线方向抛物线运动
		this.speedX = this.moveToX/100;
		this.speedY = this.moveToY/100;

		egret.Tween.get(this.mainObject).to({x:666},1000*this.speedTime);

	}
}