class Home extends egret.DisplayObjectContainer {
    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.createGameScene, this);
    }

    public _playNumText;	//剩余挑战机会
    public _startButton;	//开始按钮
    public _overButton;		//活动结束
    public _rankButton;		//查看排名
    public _alert;	//弹窗提示

  
    public _playCount = -1;  //挑战次数

    private _isPortraitScreen: boolean = false; //横竖屏

    private _info = new Info(); //公用信息表

    private createGameScene() {

		//屏幕适配
        if (/(Android)/i.test(navigator.userAgent)) {
            this.stage.setContentSize(this._isPortraitScreen ? 750 : 1196, this._isPortraitScreen ? 1196 : 750);
        } else {
            this.stage.setContentSize(this._isPortraitScreen ? 750 : 1218, this._isPortraitScreen ? 1218 : 750);
        }

        //设置背景
        var homeBackground = new Bitmap("bg_png");
		homeBackground.width = this.stage.stageWidth;
        this.addChild(homeBackground);

		//获取用户相关信息
        this.getUserInfo();

		//test
		// this._info._isfrom = "1";


    }

    private setupUI() {
		//微信=0 app=1
        if (parseInt(this._info._isfrom) == 0) {
            var introduce = new egret.TextField();
            introduce.x = this._isPortraitScreen ? 375 : 550;
            introduce.y = this._isPortraitScreen ? 600 : 375;
            introduce.textFlow = <Array<egret.ITextElement>>[
                {
                    text: "手指移动控制倍倍方向，根据记忆力判断正确位置，掉落即游戏结束。按照最高分进行排名，排名前50都有红包奖励。此外，还会随机抽取100名发送幸运红包哦~",
                    style: {"textColor": 0x275b51, "size": 28}
                },
                {
                    text: "分享给好友，让好友为你加油，可增加机会呦~", 
                    style: {"textColor": 0xff6600, "size": 28}
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
            // this._playNumText.text = "您当前有0次挑战机会";
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

        } else if (parseInt(this._info._isfrom) == 1) {
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

    }

	//查看排名
    private checkRanking(evt:egret.TouchEvent) {
        window.location.href = "https://www.beisu100.com/beisuapp/gamerank/rank/timenum/" + this._info._timenum + "/activitynum/" + this._info._activitynum + "/vuid/" + this._info._vuid + "/key/" + this._info._key + "/isfrom/" + this._info._isfrom;
    }

	//开始游戏
    private startPlayGame(evt:egret.TouchEvent) {

        this._rankButton.touchEnabled = false;
        this._startButton.touchEnabled = false;

		//test
		// this.removeChildren();
        // var _game = new Game();
        // this.addChild(_game);
		// return;

        //微信端检查是否关注
        if (parseInt(this._info._isfrom) == 0) {
            this.checkIsAttention();
        } else {
            this.removeChildren();
            var _game = new Game();
            this.addChild(_game);
        }
    }

    //http请求-------begin

    public _pageUrl = window.location.href;	//获取当前页面地址

    public getUserInfo() {

        //test app url
		this._pageUrl = "http://ceshi.beisu100.com/actity/90001/index.html?uid=5&key=1241ea11b7f3b5bf852b3bbc428ef209&isfrom=1&activitynum=9&timenum=1";

        var params = this.getUrlParams();
        this._info._key = params["key"];
        this._info._vuid = params["uid"];
        this._info._isfrom = params["isfrom"];
        this._info._timenum = params["timenum"];
        this._info._activitynum = params["activitynum"];

        //设置页面
        this.setupUI();

        //获取用户剩余挑战次数
        this.getUserCanPalyNumber();

        if (this._info._key == null) {
			alert("请先登录！");
        }
    }

	//解析接口包含的参数
    public  getUrlParams() {
        var index = this._pageUrl.indexOf("?");
        var content = this._pageUrl.substring(index);
        var url = decodeURIComponent(content);
        var theRequest = new Object();
        console.log(url.indexOf("?"));
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            var strs = str.split("&");
            console.log(strs);
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);//decodeURI
            }
        }
        return theRequest;
    }

    //获取用户剩余次数
    public getUserCanPalyNumber() {

        var params = "?vuid=" + this._info._vuid + "&key=" + this._info._key + "&timenum=" + this._info._timenum + "&activitynum=" + this._info._activitynum + "&isfrom=" + this._info._isfrom;
        var request = new egret.HttpRequest();
        request.responseType = egret.HttpResponseType.TEXT;
        //将参数拼接到url
        request.open(this._info._canPalyNumber + params, egret.HttpMethod.GET);
        console.log(this._info._canPalyNumber + params);
        request.send();
        request.addEventListener(egret.Event.COMPLETE, this.getUserCanPalyNumberSuccess, this);
        request.addEventListener(egret.IOErrorEvent.IO_ERROR, function() {
            console.log("post error : " + event);
            this._rankButton.touchEnabled = true;
            this._startButton.touchEnabled = true;
        }, this);
    }
    //剩余挑战次数
    private getUserCanPalyNumberSuccess(event:egret.Event):void {
        if (parseInt(this._info._isfrom) == 0) {
            var request = <egret.HttpRequest>event.currentTarget;
            var result = JSON.parse(request.response);

            console.log(result["data"]);

            if (result["code"] == 0) {

                var isend = result["data"]["isend"];
                if (isend != 0) {
                    this.removeChild(this._startButton);
                    this._overButton = new Bitmap("gamebody_json.ending");
                    this._overButton.x = 180;
                    this._overButton.y = 860;
                    this._overButton.touchEnabled = true;
                    this._overButton.addEventListener(egret.TouchEvent.TOUCH_TAP, function() {
                        alert("活动已结束");
                    }, this);
                    this.addChild(this._overButton);
                }
                var num_is = result["data"]["num"];
                this._playNumText.text = "您当前有" + parseInt(num_is) + "次挑战机会";
                if (result["data"]["num"] > 0) {
                    this._playCount = 1;
                } else {
                    this._playCount = 0;
                }
            }
        }
    }

    //获取是否关注
    public canEnter = -1;

    //检查是否关注
    public checkIsAttention() {

        let params = "?vuid=" + this._info._vuid + "&timenum=" + this._info._timenum + "&activitynum=" + this._info._activitynum + "&isfrom=" + this._info._isfrom;
        let request = new egret.HttpRequest();
        request.responseType = egret.HttpResponseType.TEXT;
        request.open(this._info._hasAttention + params, egret.HttpMethod.GET); 
        request.send();
        request.addEventListener(egret.Event.COMPLETE, this.checkAttentionSuccess, this);
        request.addEventListener(egret.IOErrorEvent.IO_ERROR, function() {
            alert("post error : " + event);
            this._rankButton.touchEnabled = true;
            this._startButton.touchEnabled = true;
        }, this);
    }

    private checkAttentionSuccess(event:egret.Event):void {
        let request = <egret.HttpRequest>event.currentTarget;
        let result = JSON.parse(request.response);
        alert(result["code"]);
        if (result["code"] == 0) {
            //已关注
            this.canEnter = 1;
            if (this._playCount > 0) {
                //减掉游戏次数
                this.removeChildren();
                var _game = new Game();
                this.addChild(_game);
            } else { //弹窗获取次数
                this._alert = new Alert(Alert.HomePageShare, "", "", "",0,this.stage.stageHeight);
                this._alert.x = this._isPortraitScreen ? 0 : 110;
                this._alert.y = this._isPortraitScreen ? 0 : 660;
                this._alert.rotation = this._isPortraitScreen ? 0 : -90;
                this._alert.addEventListener(AlertEvent.Share, this.shareButtonClick, this);
                this._alert.addEventListener(AlertEvent.Cancle, this.cancleButtonClick, this);
                this.addChild(this._alert);
            }
        } else if (result["code"] == 2) {
            //未关注
            this._rankButton.touchEnabled = true;
            this._startButton.touchEnabled = true;
            this.canEnter = 0;
            //进入关注界面
            $("#t").css("display","block");
        }
    }

	//关闭alert
    public cancleButtonClick() {
        this._rankButton.touchEnabled = true;
        this._startButton.touchEnabled = true;
        this.removeChild(this._alert);
    }

	//引导分享
    public shareButtonClick() {

        this.removeChild(this._alert);

        //分享引导图
        let _shareGuide = new Bitmap("shareGui_png");
        _shareGuide.touchEnabled = true;
        _shareGuide.x = this._isPortraitScreen ? 0 : 0;
        _shareGuide.y = this._isPortraitScreen ? 0 : this.stage.stageHeight;
        _shareGuide.width = this._isPortraitScreen ? this.stage.stageWidth : this.stage.stageHeight;
        _shareGuide.height = this._isPortraitScreen ? this.stage.stageHeight : this.stage.stageWidth;
        _shareGuide.rotation = this._isPortraitScreen ? 0 : -90;
        _shareGuide.addEventListener(egret.TouchEvent.TOUCH_TAP, function() {
            //关闭分享引导图片
            this.removeChild(_shareGuide);
            this._rankButton.touchEnabled = true;
            this._startButton.touchEnabled = true;
        }, this);
		this.addChild(_shareGuide);
    }


    //http请求-------end
}
