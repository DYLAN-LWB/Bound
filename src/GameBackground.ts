class GameBackground extends egret.Sprite {


    public constructor(stageW:number, stageH:number) {
        super();
     


        //舞台背景
		let background = new egret.Sprite;
        background.graphics.beginFill(0x7AC5CD,1);
        background.graphics.drawRect(0,0,stageW,stageH);
        background.graphics.endFill();
        this.addChild(background);

        let cloud1 = this.createBitmapByName("yun01_png");
        cloud1.x = 20;
        cloud1.y = 111;
        cloud1.width = 97;
        cloud1.height = 70;
        this.addChild(cloud1);
        egret.Tween.get(cloud1, {loop:true}).to({x:stageW}, 35000).to({x:-100}, 35000);

        let cloud2 = this.createBitmapByName("yun03_png");
        cloud2.x = 200;
        cloud2.y = 211;
        cloud2.width = 144;
        cloud2.height = 82;
        this.addChild(cloud2);
        egret.Tween.get(cloud2, {loop:true}).to({x:stageW}, 50000).to({x:-200}, 50000);

        let cloud3 = this.createBitmapByName("yun02_png");
        cloud3.x = 640;
        cloud3.y = 500;
        cloud3.width = 73;
        cloud3.height = 44;
        this.addChild(cloud3);
        egret.Tween.get(cloud3, {loop:true}).to({x:-100}, 30000).to({x:stageW}, 30000);

        let cloud4 = this.createBitmapByName("yun04_png");
        cloud4.x = 40;
        cloud4.y = 644;
        cloud4.width = 112;
        cloud4.height = 76;
        this.addChild(cloud4);
        egret.Tween.get(cloud4, {loop:true}).to({x:stageW}, 40000).to({x:-120}, 40000);
    }

    private createBitmapByName(name: string) {
        let result = new egret.Bitmap();
        let texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }
       
        
}