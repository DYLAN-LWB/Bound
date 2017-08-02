class Info  {
    // public  _url: string = "http://www.beisu100.com/beisuapp";	// 线上环境
    public _url: string = "http://ceshi.beisu100.com/beisuapp";	//测试环境
    
    public _hasAttention:string = this._url + "/uservote/isguanzhu";	//是否关注

    public _canPalyNumber:string = this._url + "/typos/num";	//剩余挑战次数
    public _downnum:string = this._url + "/typos/numdown5";     //减游戏次数
    public _gameover:string = this._url + "/typos/GameOver";    //游戏结束
    public _typosTempjump:string = this._url + "/typos/typosTempjump";  //加分
    public _getWord:string = this._url + "/typos/getjumpwords";  //加分

    public _vuid:string;    //用户id
    public _key:string;     //用户key
    public _isfrom:string;	//页面来源 微信=0 app=1
    public _timenum;        //第几期
    public _activitynum;    //活动编号


}