
class GameSpeedMotion extends egret.Sprite {

	private speedImage;
    private count: number = 15;
    private index: number = 0;
	private _channel: egret.SoundChannel;
	private _person = new Bitmap("beibei_png");			//弹跳对象
	private _stageW :number;

	private _place;
    public constructor(stageW:number) {
        super();
		this._stageW = stageW;

		//火箭的声音
		let sound = new egret.Sound();
		sound.addEventListener(egret.Event.COMPLETE, function() {
			this._channel = sound.play(0,0);
		}, this);
		sound.load("resource/sound/rocket.mp3");

		this._place = new Bitmap("speed1_png");
		this._place.width = this._stageW;
        this.addChild(this._place);


		this.speedImage = new Bitmap("speed1_png");
		this.speedImage.width = this._stageW;
        this.addChild(this.speedImage);

		this._person.width = 110;
		this._person.height = 110;
		this._person.x = 145;
		this._person.y = 350;
		this.addChildAt(this._person,99);

		//person动画
		egret.Tween.get(this._person).to({x:this._stageW - 150,y: 350}, 1500);

        let timer: egret.Timer = new egret.Timer(100, this.count);
		timer.addEventListener(egret.TimerEvent.TIMER,this.timerFunc,this);
		timer.start();
    }

	private timerFunc(event:egret.TimerEvent) {
        this.index += 1;

		let timer1: egret.Timer = new egret.Timer(50, 1);
		timer1.addEventListener(egret.TimerEvent.TIMER_COMPLETE,function() {

			this.speedImage.texture = RES.getRes("speed2_png");
			let timer2: egret.Timer = new egret.Timer(50, 1);
			timer2.addEventListener(egret.TimerEvent.TIMER_COMPLETE,function(){

				this.speedImage.texture = RES.getRes("speed3_png");
				if(this.index == this.count) {
						if(this.speedImage && this.speedImage.parent) {
							this.speedImage.parent.removeChild(this.speedImage)
						};
						
						if(this._person && this._person.parent) {
							this._person.parent.removeChild(this._person)
						};
						if(this._place && this._place.parent) {
							this._place.parent.removeChild(this._place)
						};
						this._channel.stop();
				}
			},this);
			timer2.start();
		},this);
		timer1.start();
	}
}