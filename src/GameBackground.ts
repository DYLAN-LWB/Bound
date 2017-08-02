class GameBackground extends egret.Sprite {


    public constructor(stageW:number, stageH:number) {
        super();
     
        //舞台背景
		let background = new egret.Sprite;
        background.graphics.beginFill(0xd0efe9,1);
        background.graphics.drawRect(0,0,stageW,stageH);
        background.graphics.endFill();
        this.addChild(background);

        let bottomImg = new Bitmap("game_bottom_png");
        bottomImg.x = 0;
        bottomImg.y = stageH - 250;
        bottomImg.width = stageW;
        bottomImg.height = 250;
        this.addChild(bottomImg);

        // let cloud1 = new Bitmap("yun01_png");
        // cloud1.x = 250;
        // cloud1.y = 211;
        // cloud1.width = 144;
        // cloud1.height = 82;
        // this.addChild(cloud1);
        // egret.Tween.get(cloud1, {loop:true}).to({x:stageW}, 50000).to({x:-200}, 50000);

        let cloud2 = new Bitmap("yun03_png");
        cloud2.x = 250;
        cloud2.y = 150;
        cloud2.width = 144;
        cloud2.height = 82;
        this.addChild(cloud2);
        egret.Tween.get(cloud2, {loop:true}).to({x:stageW}, 50000).to({x:-200}, 50000);

        let cloud3 = new Bitmap("yun02_png");
        cloud3.x = 340;
        cloud3.y = 500;
        cloud3.width = 73;
        cloud3.height = 44;
        this.addChild(cloud3);
        egret.Tween.get(cloud3, {loop:true}).to({x:-100}, 30000).to({x:stageW}, 30000);

        let cloud4 = new Bitmap("yun04_png");
        cloud4.x = 40;
        cloud4.y = 200;
        cloud4.width = 112;
        cloud4.height = 76;
        this.addChild(cloud4);
        egret.Tween.get(cloud4, {loop:true}).to({x:stageW}, 40000).to({x:-120}, 40000);
    }  
}