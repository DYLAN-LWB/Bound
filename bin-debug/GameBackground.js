var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GameBackground = (function (_super) {
    __extends(GameBackground, _super);
    function GameBackground(stageW, stageH) {
        var _this = _super.call(this) || this;
        //舞台背景
        var background = new egret.Sprite;
        background.graphics.beginFill(0xd0efe9, 1);
        background.graphics.drawRect(0, 0, stageW, stageH);
        background.graphics.endFill();
        _this.addChild(background);
        var bottomImg = new Bitmap("game_bottom_png");
        bottomImg.x = 0;
        bottomImg.y = stageH - 250;
        bottomImg.width = stageW;
        bottomImg.height = 250;
        _this.addChild(bottomImg);
        // let cloud1 = new Bitmap("yun01_png");
        // cloud1.x = 250;
        // cloud1.y = 211;
        // cloud1.width = 144;
        // cloud1.height = 82;
        // this.addChild(cloud1);
        // egret.Tween.get(cloud1, {loop:true}).to({x:stageW}, 50000).to({x:-200}, 50000);
        var cloud2 = new Bitmap("yun03_png");
        cloud2.x = 250;
        cloud2.y = 150;
        cloud2.width = 144;
        cloud2.height = 82;
        _this.addChild(cloud2);
        egret.Tween.get(cloud2, { loop: true }).to({ x: stageW }, 50000).to({ x: -200 }, 50000);
        var cloud3 = new Bitmap("yun02_png");
        cloud3.x = 340;
        cloud3.y = 500;
        cloud3.width = 73;
        cloud3.height = 44;
        _this.addChild(cloud3);
        egret.Tween.get(cloud3, { loop: true }).to({ x: -100 }, 30000).to({ x: stageW }, 30000);
        var cloud4 = new Bitmap("yun04_png");
        cloud4.x = 40;
        cloud4.y = 200;
        cloud4.width = 112;
        cloud4.height = 76;
        _this.addChild(cloud4);
        egret.Tween.get(cloud4, { loop: true }).to({ x: stageW }, 40000).to({ x: -120 }, 40000);
        return _this;
    }
    return GameBackground;
}(egret.Sprite));
__reflect(GameBackground.prototype, "GameBackground");
//# sourceMappingURL=GameBackground.js.map