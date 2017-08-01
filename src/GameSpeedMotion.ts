class SpeedMotion extends egret.Sprite {

	private speedImage;
    private count: number = 5;
    private index: number = 0;

    public constructor() {
        super();

        let timer: egret.Timer = new egret.Timer(300, this.count);
		timer.addEventListener(egret.TimerEvent.TIMER,this.timerFunc,this);
		timer.start();
    }


	private timerFunc(event:egret.TimerEvent) {
        this.index += 1;

		if(this.speedImage && this.speedImage.parent) {
			this.speedImage.parent.removeChild(this.speedImage)
		};

		this.speedImage = this.createBitmapByName("1_png");
		this.speedImage.width = this.stage.stageWidth;
        this.addChild(this.speedImage);

		let timer1: egret.Timer = new egret.Timer(100, 1);
	    timer1.addEventListener(egret.TimerEvent.TIMER_COMPLETE,this.timerComFunc1,this);
		timer1.start();
	}

	private timerComFunc1(event:egret.TimerEvent) {

		if(this.speedImage && this.speedImage.parent) {
			this.speedImage.parent.removeChild(this.speedImage)
		};

		this.speedImage = this.createBitmapByName("2_png");
		this.speedImage.width = this.stage.stageWidth;
        this.addChild(this.speedImage);

		let timer2: egret.Timer = new egret.Timer(100, 1);
	    timer2.addEventListener(egret.TimerEvent.TIMER_COMPLETE,this.timerComFunc2,this);
		timer2.start();
	}

	private timerComFunc2(event:egret.TimerEvent) {

		if(this.speedImage && this.speedImage.parent) {
			this.speedImage.parent.removeChild(this.speedImage)
		};

		this.speedImage = this.createBitmapByName("3_png");
		this.speedImage.width = this.stage.stageWidth;
        this.addChild(this.speedImage);

    
        if(this.index == this.count) {
            if(this.speedImage && this.speedImage.parent) {
			    this.speedImage.parent.removeChild(this.speedImage)
		    };
        }
	}


    private createBitmapByName(name: string) {
        let result = new egret.Bitmap();
        let texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }
}