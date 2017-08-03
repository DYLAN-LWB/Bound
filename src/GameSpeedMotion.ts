class GameSpeedMotion extends egret.Sprite {

	private speedImage;
    private count: number = 5;
    private index: number = 0;
	private _channel: egret.SoundChannel;
	private _person = new Bitmap("beibei_png");			//弹跳对象
	private _stageW :number;

    public constructor(stageW:number) {
        super();
		this._stageW = stageW;

		this._person.width = 110;
		this._person.height = 110;
		this._person.x = 145;
		this._person.y = 350;
		this.addChildAt(this._person,99);

		egret.Tween.get(this._person).to({x:this._stageW - 150,y: 250}, 1200).call(function(){
			egret.Tween.get(this._person).to({x:145,y: 350}, 300)
		},this);


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

		this.speedImage = new Bitmap("speed1_png");
		this.speedImage.width = this._stageW;
        this.addChild(this.speedImage);
		this.swapChildren(this.speedImage,this._person);
		let timer1: egret.Timer = new egret.Timer(100, 1);
	    timer1.addEventListener(egret.TimerEvent.TIMER_COMPLETE,this.timerComFunc1,this);
		timer1.start();
	}

	private timerComFunc1(event:egret.TimerEvent) {

		if(this.speedImage && this.speedImage.parent) {
			this.speedImage.parent.removeChild(this.speedImage)
		};

		this.speedImage = new Bitmap("speed2_png");
		this.speedImage.width = this._stageW;
        this.addChild(this.speedImage);
		this.swapChildren(this.speedImage,this._person);
		let timer2: egret.Timer = new egret.Timer(100, 1);
	    timer2.addEventListener(egret.TimerEvent.TIMER_COMPLETE,this.timerComFunc2,this);
		timer2.start();
	}

	private timerComFunc2(event:egret.TimerEvent) {

		if(this.speedImage && this.speedImage.parent) {
			this.speedImage.parent.removeChild(this.speedImage)
		};

		this.speedImage = new Bitmap("speed3_png");
		this.speedImage.width = this._stageW;
        this.addChild(this.speedImage);
		this.swapChildren(this.speedImage,this._person);
        if(this.index == this.count) {
            if(this.speedImage && this.speedImage.parent) {
			    this.speedImage.parent.removeChild(this.speedImage)
		    };
			
			if(this._person && this._person.parent) {
			    this._person.parent.removeChild(this._person)
		    };
			this._channel.stop();
        }
	}
}