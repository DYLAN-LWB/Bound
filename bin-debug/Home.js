var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Home = (function (_super) {
    __extends(Home, _super);
    function Home() {
        var _this = _super.call(this) || this;
        _this._playCount = -1; //挑战次数
        _this._isPortraitScreen = false; //横竖屏
        _this._info = new Info(); //公用信息表
        _this._pageUrl = window.location.href; //获取当前页面地址
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.createGameScene, _this);
        return _this;
    }
    Home.prototype.createGameScene = function () {
        //屏幕适配
        // if (/(Android)/i.test(navigator.userAgent)) {
        //     this.stage.setContentSize(this._isPortraitScreen ? 750 : 1196, this._isPortraitScreen ? 1196 : 750);
        // } else {
        //     this.stage.setContentSize(this._isPortraitScreen ? 750 : 1218, this._isPortraitScreen ? 1218 : 750);
        // }
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            this.stage.setContentSize(1218, 750);
        }
        else {
            if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
                this.stage.setContentSize(1218, 750);
            }
            else if (/(Android)/i.test(navigator.userAgent)) {
                this.stage.setContentSize(1334, 750);
            }
        }
        //设置背景
        var homeBackground = new Bitmap("bg_png");
        homeBackground.width = this.stage.stageWidth;
        homeBackground.height = this.stage.stageHeight;
        this.addChild(homeBackground);
        //获取用户相关信息
        this.getUserInfo();
    };
    Home.prototype.getUserInfo = function () {
        //test app url
        // this._pageUrl = "http://ceshi.beisu100.com/actity/90001/index.html?uid=5&key=1241ea11b7f3b5bf852b3bbc428ef209&isfrom=0&activitynum=9&timenum=1";
        this._pageUrl = "http://ceshi.beisu100.com//actity/90001/index.html?uid=68384&key=72270ed2b481ad4070af0d26dca64c60&isfrom=0&activitynum=9&timenum=1";
        // alert("this._pageUrl = "+this._pageUrl);
        //解析url参数
        var params = this.getUrlParams();
        this._info._vuid = params["uid"];
        this._info._key = params["key"];
        this._info._isfrom = params["isfrom"];
        this._info._timenum = params["timenum"];
        this._info._activitynum = params["activitynum"];
        //保存信息
        localStorage.setItem("vuid", JSON.stringify(this._info._vuid));
        localStorage.setItem("key", JSON.stringify(this._info._key));
        localStorage.setItem("isfrom", JSON.stringify(this._info._isfrom));
        localStorage.setItem("timenum", JSON.stringify(this._info._timenum));
        localStorage.setItem("activitynum", JSON.stringify(this._info._activitynum));
        //设置页面
        this.setupUI();
        //获取用户剩余挑战次数
        if (parseInt(this._info._isfrom) == 0) {
            this.getUserCanPalyNumber();
        }
        if (this._info._key == null) {
            alert("请先登录！");
        }
    };
    Home.prototype.setupUI = function () {
        //微信=0 app=1
        if (parseInt(this._info._isfrom) == 0) {
            var introduce = new egret.TextField();
            introduce.x = this._isPortraitScreen ? 375 : 550;
            introduce.y = this._isPortraitScreen ? 600 : 375;
            introduce.textFlow = [
                {
                    text: "手指移动控制倍倍方向，根据记忆力判断正确位置，掉落即游戏结束。按照最高分进行排名，排名前50都有红包奖励。此外，还会随机抽取100名发送幸运红包哦~",
                    style: { "textColor": 0x275b51, "size": 28 }
                },
                {
                    text: "分享给好友，让好友为你加油，可增加机会呦~",
                    style: { "textColor": 0xff6600, "size": 28 }
                }
            ];
            introduce.lineSpacing = 15;
            introduce.width = 600;
            introduce.anchorOffsetX = introduce.width / 2;
            introduce.anchorOffsetY = introduce.height / 2;
            introduce.rotation = this._isPortraitScreen ? 0 : -90;
            this.addChild(introduce);
            //剩余挑战机会
            this._playNumText = new egret.TextField();
            this._playNumText.size = 30;
            this._playNumText.x = this._isPortraitScreen ? 230 : 700;
            this._playNumText.y = this._isPortraitScreen ? 755 : 500;
            this._playNumText.rotation = this._isPortraitScreen ? 0 : -90;
            this._playNumText.textColor = 0x275b51;
            this._playNumText.anchorOffsetX = this._playNumText.width / 2;
            this._playNumText.anchorOffsetY = this._playNumText.height / 2;
            this._playNumText.text = "您当前有0次挑战机会";
            this.addChild(this._playNumText);
            //开始游戏按钮
            this._startButton = new Bitmap("gamebody_json.start");
            this._startButton.x = this._isPortraitScreen ? 180 : 780;
            this._startButton.y = this._isPortraitScreen ? 820 : 570;
            this._startButton.rotation = this._isPortraitScreen ? 0 : -90;
            this._startButton.touchEnabled = true;
            this._startButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.startPlayGame, this);
            this.addChild(this._startButton);
            //查看排名按钮
            this._rankButton = new Bitmap("gamebody_json.ranking");
            this._rankButton.x = this._isPortraitScreen ? 180 : 950;
            this._rankButton.y = this._isPortraitScreen ? 990 : 570;
            this._rankButton.rotation = this._isPortraitScreen ? 0 : -90;
            this._rankButton.touchEnabled = true;
            this._rankButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.checkRanking, this);
            this.addChild(this._rankButton);
        }
        else if (parseInt(this._info._isfrom) == 1) {
            //app端 页面简化
            this._startButton = new Bitmap("gamebody_json.start");
            this._startButton.x = this._isPortraitScreen ? 180 : 600;
            this._startButton.y = this._isPortraitScreen ? 760 : 570;
            this._startButton.rotation = this._isPortraitScreen ? 0 : -90;
            this._startButton.touchEnabled = true;
            this._startButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.startPlayGame, this);
            this.addChild(this._startButton);
            this._rankButton = new Bitmap("gamebody_json.ranking");
            this._rankButton.x = this._isPortraitScreen ? 180 : 800;
            this._rankButton.y = this._isPortraitScreen ? 910 : 570;
            this._rankButton.rotation = this._isPortraitScreen ? 0 : -90;
            this._rankButton.touchEnabled = true;
            this._rankButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.checkRanking, this);
            this.addChild(this._rankButton);
        }
    };
    //查看排名
    Home.prototype.checkRanking = function (evt) {
        console.log("查看排名");
        window.location.href = "https://www.beisu100.com/beisuapp/gamerank/rank/timenum/" + this._info._timenum + "/activitynum/" + this._info._activitynum + "/vuid/" + this._info._vuid + "/key/" + this._info._key + "/isfrom/" + this._info._isfrom;
    };
    //开始游戏
    Home.prototype.startPlayGame = function (evt) {
        console.log("开始游戏");
        //避免重复点击使游戏次数出错
        this._rankButton.touchEnabled = false;
        this._startButton.touchEnabled = false;
        //微信端检查是否关注
        if (parseInt(this._info._isfrom) == 0) {
            this.checkIsAttention();
        }
        else {
            this.removeChildren();
            this.addChild(new Game());
        }
    };
    //获取用户剩余次数
    Home.prototype.getUserCanPalyNumber = function () {
        var params = "?vuid=" + this._info._vuid +
            "&key=" + this._info._key +
            "&timenum=" + this._info._timenum +
            "&activitynum=" + this._info._activitynum +
            "&isfrom=" + this._info._isfrom;
        var request = new egret.HttpRequest();
        request.responseType = egret.HttpResponseType.TEXT;
        request.open(this._info._canPalyNumber + params, egret.HttpMethod.GET);
        request.send();
        request.addEventListener(egret.Event.COMPLETE, function () {
            var result = JSON.parse(request.response);
            if (result["code"] == 0) {
                this._playCount = result["data"]["num"];
                this._playNumText.text = "您当前有" + this._playCount + "次挑战机会";
                if (result["data"]["isend"] != 0) {
                    this.removeChild(this._startButton);
                    this._overButton = new Bitmap("gamebody_json.ending");
                    this._overButton.x = this._isPortraitScreen ? 180 : 780;
                    this._overButton.y = this._isPortraitScreen ? 820 : 570;
                    this._overButton.rotation = this._isPortraitScreen ? 0 : -90;
                    this._overButton.touchEnabled = true;
                    this._overButton.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                        alert("活动已结束");
                    }, this);
                    this.addChild(this._overButton);
                }
            }
        }, this);
        request.addEventListener(egret.IOErrorEvent.IO_ERROR, function () {
            alert("post error : " + event);
            this._rankButton.touchEnabled = true;
            this._startButton.touchEnabled = true;
        }, this);
    };
    //检查是否关注
    Home.prototype.checkIsAttention = function () {
        var params = "?vuid=" + this._info._vuid + "&timenum=" + this._info._timenum + "&activitynum=" + this._info._activitynum + "&isfrom=" + this._info._isfrom;
        var request = new egret.HttpRequest();
        request.responseType = egret.HttpResponseType.TEXT;
        request.open(this._info._hasAttention + params, egret.HttpMethod.GET);
        request.send();
        request.addEventListener(egret.Event.COMPLETE, function () {
            var result = JSON.parse(request.response);
            if (result["code"] == 0) {
                if (this._playCount > 0) {
                    this.removeChildren();
                    this.addChild(new Game());
                }
                else {
                    this._alert = new Alert(Alert.HomePageShare, "", "", "", 0, this.stage.stageHeight);
                    this._alert.x = this._isPortraitScreen ? 0 : 110;
                    this._alert.y = this._isPortraitScreen ? 0 : 750;
                    this._alert.rotation = this._isPortraitScreen ? 0 : -90;
                    this._alert.addEventListener(AlertEvent.Share, this.shareButtonClick, this);
                    this._alert.addEventListener(AlertEvent.Cancle, this.cancleButtonClick, this);
                    this.addChild(this._alert);
                }
            }
            else if (result["code"] == 2) {
                this._rankButton.touchEnabled = true;
                this._startButton.touchEnabled = true;
                document.getElementById("attention").style.display = "block";
            }
        }, this);
        request.addEventListener(egret.IOErrorEvent.IO_ERROR, function () {
            alert("post error : " + event);
            this._rankButton.touchEnabled = true;
            this._startButton.touchEnabled = true;
        }, this);
    };
    //关闭alert
    Home.prototype.cancleButtonClick = function () {
        this._rankButton.touchEnabled = true;
        this._startButton.touchEnabled = true;
        this.removeChild(this._alert);
    };
    //引导分享
    Home.prototype.shareButtonClick = function () {
        this.removeChild(this._alert);
        //分享引导图
        var _shareGuide = new Bitmap("shareGui_png");
        _shareGuide.touchEnabled = true;
        _shareGuide.x = this._isPortraitScreen ? 0 : 0;
        _shareGuide.y = this._isPortraitScreen ? 0 : this.stage.stageHeight;
        _shareGuide.width = this._isPortraitScreen ? this.stage.stageWidth : this.stage.stageHeight;
        _shareGuide.height = this._isPortraitScreen ? this.stage.stageHeight : this.stage.stageWidth;
        _shareGuide.rotation = this._isPortraitScreen ? 0 : -90;
        _shareGuide.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            //关闭分享引导图片
            this.removeChild(_shareGuide);
            this._rankButton.touchEnabled = true;
            this._startButton.touchEnabled = true;
        }, this);
        this.addChild(_shareGuide);
    };
    //解析接口包含的参数
    Home.prototype.getUrlParams = function () {
        var index = this._pageUrl.indexOf("?");
        var content = this._pageUrl.substring(index);
        var url = decodeURIComponent(content);
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            var strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]); //decodeURI
            }
        }
        return theRequest;
    };
    return Home;
}(egret.DisplayObjectContainer));
__reflect(Home.prototype, "Home");
//# sourceMappingURL=Home.js.map