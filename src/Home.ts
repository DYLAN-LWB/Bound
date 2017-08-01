class Home extends egret.DisplayObjectContainer {
    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.createGameScene, this);
    }

    public _playNumText;	//剩余挑战机会
    public _startButton;	//开始按钮
    public _overButton;		//活动结束
    public _rankButton;		//查看排名
    public _commonAlert;	//弹窗提示

    private createGameScene() {

		//屏幕适配
        // if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        //     this.stage.setContentSize(750,1218);
        // } else if (/(Android)/i.test(navigator.userAgent)) {
        //     this.stage.setContentSize(750,1196);
        // } else {
        //     this.stage.setContentSize(750,1218);
        // }

        //设置背景
        var homeBackground = new Bitmap("bg_png");
		homeBackground.width = this.stage.stageWidth;
        this.addChild(homeBackground);

		//获取用户相关信息
        this.getUserInfo();

		//获取用户剩余挑战次数
        this.getCanPalyNumber(this._vuid, this._key);

		//test
		this._isfrom = "0";

		//微信=0 app=1
        if (parseInt(this._isfrom) == 0) {
            var introduce = new egret.TextField();
            introduce.x = 375;
            introduce.y = 600;
            introduce.textFlow = <Array<egret.ITextElement>>[
                {
                    text: "手指移动控制倍倍方向，根据记忆力判断正确位置，掉落即游戏结束。按照最高分进行排名，排名前50都有红包奖励。此外，还会随机抽取100名发送幸运红包哦~",
                    style: {"textColor": 0x275b51, "size": 28}
                },
                {text: "分享给好友，让好友为你加油，可增加机会呦~", style: {"textColor": 0xff6600, "size": 28}}
            ];
            introduce.lineSpacing = 15;
            introduce.width = 600;
            introduce.anchorOffsetX = introduce.width / 2;
            introduce.anchorOffsetY = introduce.height / 2;
            this.addChild(introduce);

			//剩余挑战机会
            this._playNumText = new egret.TextField();
            this._playNumText.size = 30;
            this._playNumText.x = 230;
            this._playNumText.y = 755;
            this._playNumText.textColor = 0x275b51;
            this._playNumText.anchorOffsetX = this._playNumText.width / 2;
            this._playNumText.anchorOffsetY = this._playNumText.height / 2;
            this._playNumText.text = "您当前有0次挑战机会";
            this.addChild(this._playNumText);

            //开始游戏按钮
            this._startButton = new Bitmap("gamebody_json.start");
            this._startButton.x = 180;
            this._startButton.y = 820;
            this._startButton.touchEnabled = true;
            this._startButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.startTheGame, this);
            this.addChild(this._startButton);

			//查看排名按钮
            this._rankButton = new Bitmap("gamebody_json.ranking");
            this._rankButton.x = 180;
            this._rankButton.y = 990;
            this._rankButton.touchEnabled = true;
            this._rankButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.checkRanking, this);
            this.addChild(this._rankButton);

        } else if (parseInt(this._isfrom) == 1) {
			//app端 页面简化
            this._startButton = new Bitmap("gamebody_json.start");
            this._startButton.x = 180;
            this._startButton.y = 760;
            this._startButton.touchEnabled = true;
            this._startButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.startTheGame, this);
            this.addChild(this._startButton);

            this._rankButton = new Bitmap("gamebody_json.ranking");
            this._rankButton.x = 180;
            this._rankButton.y = 910;
            this._rankButton.touchEnabled = true;
            this._rankButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.checkRanking, this);
            this.addChild(this._rankButton);
        }
    }

	//查看排名
    private checkRanking(evt:egret.TouchEvent) {
        window.location.href = "https://www.beisu100.com/beisuapp/gamerank/rank/timenum/" + this._timenum + "/activitynum/" + this._activitynum + "/vuid/" + this._vuid + "/key/" + this._key + "/isfrom/" + this._isfrom;
    }

	//开始游戏
    private startTheGame(evt:egret.TouchEvent) {
        this._rankButton.touchEnabled = false;
        this._startButton.touchEnabled = false;

		//test
		this.removeChildren();
        var _game = new Game();
        this.addChild(_game);
		return;

        if (parseInt(this._isfrom) == 0) {
			//检查是否关注
            this.checkIsAttention(this._vuid);
        } else {
            this.removeChildren();
            var _game = new Game();
            this.addChild(_game);
        }
    }

    //http请求-------begin

    public  _url: string = "https://www.beisu100.com/beisuapp";	//线上环境
    public  _canPalyNumber:string = this._url + "/typos/num";	//剩余挑战次数
    public  _hasAttention:string = this._url + "/uservote/isguanzhu";	//是否关注

    //获取当前用户的 vuid wid
    //从链接中截取uid和key
    public _pageUrl = window.location.href;	//获取当前页面地址
    public _timenum;
    public _activitynum;
    public _key:string;
    public _vuid:string;
    public _isfrom:string;	//页面来源 微信=0 app=1

    public getUserInfo() {

		this._pageUrl = "https://www.beisu100.com/actity/80001/index.html?uid=318&key=d7318727e22014ac71f7631652315fe7&isfrom=0&activitynum=8&timenum=1";

		//微信
        if (this._pageUrl == "https://www.beisu100.com/actity/80001/index.html") {
            this._vuid = localStorage.getItem("vuid").substring(1, this._vuid.length - 1);
            this._key = localStorage.getItem("key").substring(1, this._key.length - 1);
            this._isfrom = localStorage.getItem("isfrom").substring(1, this._isfrom.length - 1);
            this._timenum = localStorage.getItem("timenum").substring(1, this._timenum.length - 1);
            this._activitynum = localStorage.getItem("activitynum").substring(1, this._activitynum.length - 1);

        } else {	//app
            var params = this.getUrlParams();
            this._key = params["key"];
            this._vuid = params["uid"];
            this._isfrom = params["isfrom"] + ""
            this._timenum = params["timenum"] + ""
            this._activitynum = params["activitynum"] + ""

			// 走本地缓存
            if (this._vuid == null) {
                this._vuid = localStorage.getItem("vuid");
                this._key = localStorage.getItem("key");
                this._isfrom = localStorage.getItem("isfrom");
                this._timenum = localStorage.getItem("timenum");
                this._activitynum = localStorage.getItem("activitynum");
                this._vuid = this._vuid.substring(1, this._vuid.length - 1);
                this._key = this._key.substring(1, this._key.length - 1);
                this._isfrom = this._isfrom.substring(1, this._isfrom.length - 1);
                this._timenum = this._timenum.substring(1, this._timenum.length - 1);
                this._activitynum = this._activitynum.substring(1, this._activitynum.length - 1);
            }
        }

        if (this._key != null) {
			//保存信息
            localStorage.setItem("vuid", JSON.stringify(this._vuid));
            localStorage.setItem("key", JSON.stringify(this._key))
            localStorage.setItem("isfrom", JSON.stringify(this._isfrom));
            localStorage.setItem("timenum", JSON.stringify(this._timenum))
            localStorage.setItem("activitynum", JSON.stringify(this._activitynum));
        } else {
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

    //获取是否关注
    public canEnter = -1;

    public checkIsAttention(_vuid) {

        console.log(this._hasAttention + "?vuid=" + _vuid + "&timenum=" + this._timenum + "&activitynum=" + this._activitynum + "&isfrom=" + this._isfrom);

		//参数
        var params = "?vuid=" + _vuid + "&timenum=" + this._timenum + "&activitynum=" + this._activitynum + "&isfrom=" + this._isfrom;
		//请求体
        var request = new egret.HttpRequest();
        request.responseType = egret.HttpResponseType.TEXT;
        request.open(this._hasAttention + params, egret.HttpMethod.GET); //将参数拼接到url
        request.send();
        request.addEventListener(egret.Event.COMPLETE, this.checkAttentionSuccess, this);
        request.addEventListener(egret.IOErrorEvent.IO_ERROR, this.checkAttentionError, this);
    }

    private checkAttentionSuccess(event:egret.Event):void {
        var request = <egret.HttpRequest>event.currentTarget;
        var result = JSON.parse(request.response);
        if (result["code"] == 0) {
            //已关注
            this.canEnter = 1;
            if (this.canReplay > 0) {
                //减掉游戏次数
                this.removeChildren();
                var _game = new Game();
                this.addChild(_game);
            } else { //弹窗获取次数
                this._commonAlert = new Alert(Alert.HomePageShare, "", "", "",0,this.stage.stageHeight);
                this._commonAlert.x = 0;
                this._commonAlert.y = 0;
                this.addChild(this._commonAlert);
                //设置自定义alert监听
                this._commonAlert.addEventListener(AlertEvent.Share, this.alertShareGame, this);
                this._commonAlert.addEventListener(AlertEvent.Cancle, this.cancleAlert, this);
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

	private checkAttentionError(event:egret.IOErrorEvent):void {
        console.log("post error : " + event);
        this._rankButton.touchEnabled = true;
        this._startButton.touchEnabled = true;
    }

	//关闭alert
    public cancleAlert() {
        this._rankButton.touchEnabled = true;
        this._startButton.touchEnabled = true;
        this.removeChild(this._commonAlert);
    }

    public _shareGuide;

	//引导分享
    public alertShareGame() {

        this.removeChild(this._commonAlert);

        this._shareGuide = new Bitmap("shareGui_png");
        this._shareGuide.touchEnabled = true;
        this._shareGuide.width = this.stage.stageWidth;
        this._shareGuide.addEventListener(egret.TouchEvent.TOUCH_TAP, this.hiddeguid, this);
		this.addChild(this._shareGuide);

    }
	//关闭分享引导图片
    public hiddeguid() {
        this.removeChild(this._shareGuide);
        this._rankButton.touchEnabled = true;
        this._startButton.touchEnabled = true;
    }

    //获取挑战次数
    public canReplay = -1;

    public getCanPalyNumber(_vuid:string, _key:string) {
        console.log(this._canPalyNumber + "?vuid=" + _vuid + "&key=" + _key + "&timenum=" + this._timenum + "&activitynum=" + this._activitynum + "&isfrom=" + this._isfrom);
        var params = "?vuid=" + _vuid + "&key=" + _key + "&timenum=" + this._timenum + "&activitynum=" + this._activitynum + "&isfrom=" + this._isfrom;
        var request = new egret.HttpRequest();
        request.responseType = egret.HttpResponseType.TEXT;
        //将参数拼接到url
        request.open(this._canPalyNumber + params, egret.HttpMethod.GET);
        request.send();
        request.addEventListener(egret.Event.COMPLETE, this.getPlayNumberSuccess, this);
        request.addEventListener(egret.IOErrorEvent.IO_ERROR, this.getPlayNumberError, this);

    }

    private getPlayNumberSuccess(event:egret.Event):void {
        if (parseInt(this._isfrom) == 0) {
            var request = <egret.HttpRequest>event.currentTarget;
            var result = JSON.parse(request.response);
            if (result["code"] == 0) {
                var isend = result["data"]["isend"];
                if (isend != 0) {
                    this.removeChild(this._startButton);
                    this._overButton = new Bitmap("gamebody_json.ending");
                    this._overButton.x = 180;
                    this._overButton.y = 860;
                    this._overButton.touchEnabled = true;
                    this._overButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.endActivity, this);
                    this.addChild(this._overButton);
                }
                var num_is = result["data"]["num"];
                this._playNumText.text = "您当前有" + parseInt(num_is) + "次挑战机会";
                if (result["data"]["num"] > 0) {
                    this.canReplay = 1;
                }
                else {
                    this.canReplay = 0;
                }
            }
        }
    }

    public endActivity() {
        alert("活动已结束");
    }

    private getPlayNumberError(event:egret.IOErrorEvent):void {
        console.log("post error : " + event);
        this._rankButton.touchEnabled = true;
        this._startButton.touchEnabled = true;
    }

    //http请求-------end
}
