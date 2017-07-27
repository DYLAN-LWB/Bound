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

	
	private mainObject = this.createBitmapByName("beibei_png");
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
		this.mainObject.y = 400;
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
		this.mainObject.x = 100;
		this.mainObject.y = 400;
		//触摸时拿到触摸点的位置
		this.touchPoint.x = event.localX;
		this.touchPoint.y = event.localY;
	}

	private guideLine:egret.Shape = new egret.Shape();	//路径引导线
	private moveToX: number;	//X坐标将要移动到的位置
	private moveToY: number;	//Y坐标将要移动到的位置
	private maxLen: number = 150;
	private lineLen:number;


	private touchMove(event: egret.TouchEvent) {
	
		//清除上次画的线
		this.guideLine.graphics.clear();

		//计算x,y移动到的坐标
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

		//设置贝塞尔曲线控制点
		let controlX = this.objectPoint.x + (this.moveToX - this.objectPoint.x)/2;
		let controlY = this.objectPoint.y + (this.moveToY - this.objectPoint.y)/2;

		//画贝塞尔曲线
 		this.guideLine.graphics.lineStyle(5,0x00ff00);
        this.guideLine.graphics.moveTo(this.objectPoint.x, this.objectPoint.y);	//起点
		this.guideLine.graphics.curveTo(controlX, controlY, this.moveToX, this.moveToY);	//控制点,终点
        this.guideLine.graphics.endFill();
        this.addChild(this.guideLine);
	}

	private highX: number;
	private highY: number;
	private highCX: number;
	private highCY: number;

	private touchEnd(event: egret.TouchEvent) {

		this.guideLine.graphics.clear();
		this.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMove, this);

		//根据线的长度计算最高点 2倍
		this.highX = this.objectPoint.x + (this.moveToX - this.objectPoint.x)*3;
		this.highY = this.objectPoint.y - this.objectWH - (this.objectPoint.y - this.moveToY)*3;
		// this.highCX = this.objectPoint.x + (this.highX - this.objectPoint.x)/2;
		// this.highCY = this.objectPoint.y - this.objectWH + (this.highY - this.objectPoint.y)/2;



		// var line1 = new egret.Shape()
 		// line1.graphics.lineStyle(5,0x87CEFA);
        // line1.graphics.moveTo(this.objectPoint.x, this.objectPoint.y - this.objectWH);	//起点
		// line1.graphics.lineTo(this.highX, this.highY);
		// line1.graphics.lineTo(this.highX*2 - this.objectPoint.x, this.stageH);
        // line1.graphics.endFill();
        // this.addChild(line1);


		// var line = new egret.Shape()
 		// line.graphics.lineStyle(1,0x4B0082);
        // line.graphics.moveTo(this.objectPoint.x, this.objectPoint.y - this.objectWH);	//起点
		// line.graphics.curveTo(this.highX, this.highY-300, this.highX*2 - this.objectPoint.x, this.stageH);	//控制点,终点
        // line.graphics.endFill();
        // this.addChild(line);

		// //移动到最高点
		// egret.Tween.get(this.mainObject)
		// .to({x:this.highX, y:this.highY},1500)
		// .to({x:this.highX*2 - this.objectPoint.x, y:this.stageH},1500);


		egret.Tween.get(this).to({factor: 1}, 2000);
	}

	public get factor():number {
        return 0;
    }
 
    public set factor(value:number) {
		console.log("set factor");
		this.mainObject.x = (1 - value) * (1 - value) * this.objectPoint.x + 2 * value * (1 - value) * this.highX + value * value * (this.highX*2 - this.objectPoint.x);
		this.mainObject.y = (1 - value) * (1 - value) * (this.objectPoint.y - this.objectWH) + 2 * value * (1 - value) * (this.highY-300) + value * value * this.stageH;
    }
}