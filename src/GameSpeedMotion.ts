class SpeedMotion extends egret.Sprite {

	private speedImage;
    private count: number = 5;
    private index: number = 0;
	private _channel: egret.SoundChannel;

    public constructor() {
        super();

        let timer: egret.Timer = new egret.Timer(300, this.count);
		timer.addEventListener(egret.TimerEvent.TIMER,this.timerFunc,this);
		timer.start();

		//火箭的声音
		let sound = new egret.Sound();
		sound.addEventListener(egret.Event.COMPLETE, function() {
			this._channel = sound.play(0,0);
		}, this);
		sound.load("resource/sound/rocket.mp3");
    }


	private timerFunc(event:egret.TimerEvent) {
        this.index += 1;

		if(this.speedImage && this.speedImage.parent) {
			this.speedImage.parent.removeChild(this.speedImage)
		};

		this.speedImage = new Bitmap("1_png");
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

		this.speedImage = new Bitmap("2_png");
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

		this.speedImage = new Bitmap("3_png");
		this.speedImage.width = this.stage.stageWidth;
        this.addChild(this.speedImage);

    
        if(this.index == this.count) {
            if(this.speedImage && this.speedImage.parent) {
			    this.speedImage.parent.removeChild(this.speedImage)
		    };

			this._channel.stop();
        }
	}
}