class Info  {
    // public  _url: string = "http://www.beisu100.com/beisuapp";	// 线上环境
    public  _url: string = "http://ceshi.beisu100.com/beisuapp";	//测试环境
    public _timenum;        //第几期
    public _activitynum;    //活动编号
    public _key:string;     //用户key
    public _vuid:string;    //用户id
    public _isfrom:string;	//页面来源 微信=0 app=1



    public  _canPalyNumber:string = this._url + "/typos/num";	//剩余挑战次数
    public  _hasAttention:string = this._url + "/uservote/isguanzhu";	//是否关注
}