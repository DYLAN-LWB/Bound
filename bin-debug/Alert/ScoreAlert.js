var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/***
 *弹窗对话框
 */
var ScoreAlert = (function (_super) {
    __extends(ScoreAlert, _super);
    function ScoreAlert(type, score, highScore, ranking, descstate, screenwith) {
        var _this = _super.call(this) || this;
        _this.type = type;
        _this.score = score;
        _this.highScore = highScore;
        _this.ranking = ranking;
        _this.descstate = descstate;
        _this.screenwith = screenwith;
        _this.initView();
        return _this;
    }
    ScoreAlert.prototype.initView = function () {
        var bg = this.createBitmapByName("alert_bg");
        bg.height = this.screenwith;
        this.addChild(bg);
        switch (this.type) {
            case 1:
                var alertbg = this.createBitmapByName("gamebody_json.prompt_03");
                this.addChild(alertbg);
                alertbg.x = 370;
                alertbg.y = 480;
                alertbg.anchorOffsetX = alertbg.width / 2;
                alertbg.anchorOffsetY = alertbg.height / 2;
                var dec = new egret.TextField();
                dec.x = 370;
                dec.y = 460;
                dec.size = 30;
                dec.fontFamily = "Microsoft YaHei";
                dec.verticalAlign = egret.VerticalAlign.BOTTOM;
                dec.textColor = 0xff3153;
                dec.text = "五次机会已经用完了哦~分享给好友，让好友为你加油，就可以获得重玩的机会呦~";
                dec.lineSpacing = 10;
                dec.width = 400;
                dec.anchorOffsetX = dec.width / 2;
                dec.anchorOffsetY = dec.height / 2;
                this.addChild(dec);
                var canclebt = this.createBitmapByName("gamebody_json.btn_03");
                this.addChild(canclebt);
                canclebt.x = 230;
                canclebt.y = 610;
                canclebt.anchorOffsetX = canclebt.width / 2;
                canclebt.anchorOffsetY = canclebt.height / 2;
                canclebt.touchEnabled = true;
                canclebt.addEventListener(egret.TouchEvent.TOUCH_TAP, this.cancleShareGame, this);
                var sharebt = this.createBitmapByName("gamebody_json.btn_05");
                this.addChild(sharebt);
                sharebt.x = 510;
                sharebt.y = 610;
                sharebt.anchorOffsetX = sharebt.width / 2;
                sharebt.anchorOffsetY = sharebt.height / 2;
                sharebt.touchEnabled = true;
                sharebt.addEventListener(egret.TouchEvent.TOUCH_TAP, this.shareGame, this);
                break;
            case 2:
                var gameover = this.createBitmapByName("gamebody_json.tan");
                this.addChild(gameover);
                gameover.x = 370;
                gameover.y = 480;
                gameover.anchorOffsetX = gameover.width / 2;
                gameover.anchorOffsetY = gameover.height / 2;
                if (this.descstate == 1) {
                    var text = new egret.TextField();
                    text.x = 140;
                    text.y = 380;
                    text.size = 32;
                    text.fontFamily = "Microsoft YaHei";
                    text.verticalAlign = egret.VerticalAlign.BOTTOM;
                    text.textFlow = [
                        {
                            text: "防作弊系统检测:",
                            style: { "textColor": 0x7a2c47, "size": 22 }
                        },
                        { text: "成绩无效,如有问题,请联系客服", style: { "textColor": 0xff1e00, "size": 22 } }
                    ];
                    text.anchorOffsetY = text.height / 2;
                    this.addChild(text);
                }
                var score = new egret.TextField();
                score.x = 420;
                score.y = 420;
                score.size = 42;
                score.fontFamily = "Microsoft YaHei";
                score.verticalAlign = egret.VerticalAlign.BOTTOM;
                score.textColor = 0xff4665;
                score.text = this.score;
                score.anchorOffsetX = score.width / 2;
                score.anchorOffsetY = score.height / 2;
                this.addChild(score);
                var highScore = new egret.TextField();
                highScore.x = 415;
                highScore.y = 470;
                highScore.size = 32;
                highScore.fontFamily = "Microsoft YaHei";
                highScore.verticalAlign = egret.VerticalAlign.BOTTOM;
                highScore.textColor = 0xb64e0f;
                highScore.text = this.highScore;
                highScore.anchorOffsetX = highScore.width / 2;
                highScore.anchorOffsetY = highScore.height / 2;
                this.addChild(highScore);
                var ranking = new egret.TextField();
                ranking.x = 400;
                ranking.y = 520;
                ranking.size = 32;
                ranking.fontFamily = "Microsoft YaHei";
                ranking.verticalAlign = egret.VerticalAlign.BOTTOM;
                ranking.textColor = 0xb64e0f;
                ranking.text = this.ranking;
                ranking.anchorOffsetY = ranking.height / 2;
                this.addChild(ranking);
                var rankings = this.createBitmapByName("gamebody_json.list");
                this.addChild(rankings);
                rankings.x = 230;
                rankings.y = 610;
                rankings.anchorOffsetX = rankings.width / 2;
                rankings.anchorOffsetY = rankings.height / 2;
                rankings.touchEnabled = true;
                rankings.addEventListener(egret.TouchEvent.TOUCH_TAP, this.gotoRanking, this);
                var reastgame = this.createBitmapByName("gamebody_json.return");
                this.addChild(reastgame);
                reastgame.x = 510;
                reastgame.y = 610;
                reastgame.anchorOffsetX = reastgame.width / 2;
                reastgame.anchorOffsetY = reastgame.height / 2;
                reastgame.touchEnabled = true;
                reastgame.addEventListener(egret.TouchEvent.TOUCH_TAP, this.reastGame, this);
                break;
            case 3:
                var alertbggame = this.createBitmapByName("gamebody_json.prompt_03");
                this.addChild(alertbggame);
                alertbggame.x = 370;
                alertbggame.y = 480;
                alertbggame.anchorOffsetX = alertbggame.width / 2;
                alertbggame.anchorOffsetY = alertbggame.height / 2;
                var decgame = new egret.TextField();
                decgame.x = 370;
                decgame.y = 460;
                decgame.size = 30;
                decgame.fontFamily = "Microsoft YaHei";
                decgame.verticalAlign = egret.VerticalAlign.BOTTOM;
                decgame.textColor = 0xff3153;
                decgame.text = "五次机会已经用完了哦~分享给好友，让好友为你加油，就可以获得重玩的机会呦~";
                decgame.lineSpacing = 10;
                decgame.width = 400;
                decgame.anchorOffsetX = decgame.width / 2;
                decgame.anchorOffsetY = decgame.height / 2;
                this.addChild(decgame);
                var canclebtgame = this.createBitmapByName("gamebody_json.btn_03");
                this.addChild(canclebtgame);
                canclebtgame.x = 230;
                canclebtgame.y = 610;
                canclebtgame.anchorOffsetX = canclebtgame.width / 2;
                canclebtgame.anchorOffsetY = canclebtgame.height / 2;
                canclebtgame.touchEnabled = true;
                canclebtgame.addEventListener(egret.TouchEvent.TOUCH_TAP, this.cancleShareGame, this);
                var sharebtgame = this.createBitmapByName("gamebody_json.btn_05");
                this.addChild(sharebtgame);
                sharebtgame.x = 510;
                sharebtgame.y = 610;
                sharebtgame.anchorOffsetX = sharebtgame.width / 2;
                sharebtgame.anchorOffsetY = sharebtgame.height / 2;
                sharebtgame.touchEnabled = true;
                sharebtgame.addEventListener(egret.TouchEvent.TOUCH_TAP, this.shareGame, this);
                break;
        }
    };
    ScoreAlert.prototype.gotoRanking = function () {
        var rankingevent = new RankingEvent(RankingEvent.DATE);
        this.dispatchEvent(rankingevent);
    };
    ScoreAlert.prototype.reastGame = function () {
        var restartevent = new RestartEvent(RestartEvent.DATE);
        this.dispatchEvent(restartevent);
    };
    ScoreAlert.prototype.shareGame = function () {
        var daterEvent = new AlertEvent(AlertEvent.DATE);
        this.dispatchEvent(daterEvent);
    };
    ScoreAlert.prototype.cancleShareGame = function () {
        var cancleEvent = new CancleEvent(CancleEvent.DATE);
        this.dispatchEvent(cancleEvent);
    };
    ScoreAlert.prototype.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    return ScoreAlert;
}(egret.Sprite));
ScoreAlert.HomePageShare = 1;
ScoreAlert.GamePageScore = 2;
ScoreAlert.GamePageShare = 3;
__reflect(ScoreAlert.prototype, "ScoreAlert");
//# sourceMappingURL=ScoreAlert.js.map