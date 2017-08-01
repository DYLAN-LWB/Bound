var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Info = (function () {
    function Info() {
        // public  _url: string = "http://www.beisu100.com/beisuapp";	// 线上环境
        this._url = "http://ceshi.beisu100.com/beisuapp"; //测试环境
        this._canPalyNumber = this._url + "/typos/num"; //剩余挑战次数
        this._hasAttention = this._url + "/uservote/isguanzhu"; //是否关注
    }
    return Info;
}());
__reflect(Info.prototype, "Info");
//# sourceMappingURL=Info.js.map