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
	private objectBeginPoint = new egret.Point(0,0);	//出发点
	private objectWH:number = 50;

	private touchBeginPoint = new egret.Point(0,0);
	private lineMaxW: number; //引导线最高长度

    private onAddToStage(event: egret.Event) {

		this.stageW = this.stage.stageWidth;
		this.stageH = this.stage.stageHeight;
		

		let stageBackground = this.createBitmapByName("testbg_png");
		stageBackground.x = 0;
		stageBackground.y = 0;
		stageBackground.width = this.stageW;
		stageBackground.height = this.stageH;
		this.addChild(stageBackground);

		this.mainObject.x = 100;
		this.mainObject.y = 200;
		this.mainObject.width = this.objectWH;
		this.mainObject.height = this.objectWH;
		this.addChild(this.mainObject);

		this.objectBeginPoint.x = this.mainObject.x + this.objectWH/2;
		this.objectBeginPoint.y = this.mainObject.y + this.objectWH;


		this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBegin, this);
		this.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.touchEnd, this);

    }

	private touchBegin(event: egret.TouchEvent) {

		this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMove, this);

		console.log(event.localX);
		console.log(event.localY);

		this.touchBeginPoint.x = event.localX;
		this.touchBeginPoint.y = event.localY;

	}

	private guideLine:egret.Shape = new egret.Shape();

	private moveX: number;
	private moveY: number;

	private touchMove(event: egret.TouchEvent) {
	

		this.guideLine.graphics.clear();
		this.moveX = this.objectBeginPoint.x + event.localX - this.touchBeginPoint.x;
		this.moveY = this.objectBeginPoint.y + event.localY - this.touchBeginPoint.y;

		let controlX = this.objectBeginPoint.x + (this.moveX - this.objectBeginPoint.x)/2;
		let controlY = this.objectBeginPoint.y + (this.moveY - this.objectBeginPoint.y)/2;
 		this.guideLine.graphics.lineStyle(5,0x00ff00);
        this.guideLine.graphics.moveTo(this.objectBeginPoint.x, this.objectBeginPoint.y);
		this.guideLine.graphics.curveTo(controlX, controlY - 10, this.moveX, this.moveY);
        this.guideLine.graphics.endFill();
        this.addChild(this.guideLine);


	}


	private touchEnd(event: egret.TouchEvent) {

		this.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMove, this);

		this.guideLine.graphics.clear();
	}
}