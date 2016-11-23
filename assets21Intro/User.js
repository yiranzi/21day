/**
 * 登录授权
 * Created by lip on 2016/6/7.
 */
var $ = require('jquery');
var React = require('react');
var ReactDom = require('react-dom');
var Util = require('./Util');
var Config = require('./Config');

const ACCESS_TOKEN_API = Util.getAPIUrl('authorization');
const USER_LEVEL_GENERAL = 0; //普通用户
const USER_LEVEL_VIP = 1;   //VIP用户（已付费）

//用户信息
var userInfo = null;
var userProfile = null;

var OnFire =require('onfire.js');

var PayController = require('./PayController');
var RankingList = require('./RankingList');
var GHGuider = require('./component/GHGuider');
var DoneToast = require('./component/DoneToast');
var Loading = require('./Loading');


//免费期限
var FREE_DEADLINE = '2016/7/22 12:0:0';

class User {

    /**
     * 获取用户信息
     * @returns {*}
     */
    static getUserInfo() {
        return userInfo || {};
    }




    /**
     * 初始化用户信息
     * 非微信浏览器不加载数据
     */
    static initAccessInfo() {
        if( !Util.isWeixin() ) {
            //QQ浏览器中不加载数据
            return;
        }

        console.log('111111111111');


        //初始化微信通用接口
        User.signWxApi();

        //蓝号进行授权后的
        if(Util.getUrlPara('istopay')){
            //设置支付APPID
            Util.setPayAppId();
            //从服务器上获取用于支付的openId
            User.getPayOpenIdFromSever();

            return;
        }


        //获取微信用户信息
        if(User.getWxUserInfoFromServer()) {
            //重定向走之后结束动作
            return;
        }
    }

    /**
     * 拉取服务器端的微信用户信息
     */
    static getWxUserInfoFromServer() {
        //携带在地址栏的code信息
        let code = Util.getUrlPara('code'),
            APIUrl = Util.getAPIUrl('base_login');

        if( !code ) {
            //地址栏里没有code 信息则重定向去微信静默授权
            User.redirectToBaseInfo(false);
            return true;
        }

        let jsonData = JSON.stringify({'code': code});
        if( Util.getUrlPara('isuserinfo') ) {
            //如果正在请求用户信息，则发送注册请求
            APIUrl = Util.getAPIUrl('userinfo_authorization');
        }

        $.ajax({
            url: APIUrl,//静默授权登录
            data: jsonData,
            type: 'post',
            cache: false,
            contentType: 'application/json;charset=utf-8',
            dataType:'json',
            headers: {
                Accept:"application/json"
            },
            beforeSend: (request) => {
                request.setRequestHeader("X-iChangTou-Json-Api-Token", "DE:_:w2qlJFV@ccOeiq41ENp><ETXh3o@aX8M<[_QOsZ<d8[Yz:NIMcKwpjtBk0e");
            },
            success: (data)=>{
                User.onGetWxInfoSuccess(data)
            },
            error: ()=>{
                User.onGetWxInfoError(false)
            }
        });

    }

    /**
     * 请求微信数据后的回调函数
     * @param data
     */
    static onGetWxInfoSuccess(data) {
        if( !data || !data.userId ) {
            //如果后台没有数据，代表没有授权过，去往snsapi_userinfo授权
            User.redirectToUserinfo(false);
            return;
        }

        //保存用户信息
        userInfo = {};
        userInfo.userId = data.userId;
        userInfo.sessionId = data.sessionId;
        userInfo.openId = data.openId;
        userInfo.nickName = data.nickName;
        if( userInfo.nickName && userInfo.nickName.length > 10 ){
            userInfo.nickName = userInfo.nickName.substr(0, userInfo.nickName.length-6);
        }

        userInfo.headImage = data.headImage;

        userInfo.subscribe = data.subscribe;//是否关注公众号

        userInfo.unionId = data.unionId;

        //配置分享内容
        User.shareConfig();

        console.log('unionId'+userInfo.unionId);


        //查询是否有支付的openId，没有就去做支付账号的登录，
        if(data.payOpenId){

            userInfo.payOpenId = data.payOpenId;

            //设置用户信息缓存 此处缓存是为了第二次蓝号授权后，可以使用用户的其他信息
            localStorage.setItem('user-info',JSON.stringify(userInfo));


            //触发登录成功事件
            OnFire.fire('OAUTH_SUCCESS',data);

            Loading.hideLoading();
        }
        else{
            //设置用户信息缓存 此处缓存是为了第二次蓝号授权后，可以使用用户的其他信息
            localStorage.setItem('user-info',JSON.stringify(userInfo));

            //设置支付APPID
            Util.setPayAppId();

            //静默授权（使用可支付公号的APPID）
            console.log('静默授权（使用可支付公号的APPID）');
            User.redirectToBaseInfo(true);
        }


    }

    /**
     * 从服务器上获取用于支付的openId
     */
    static getPayOpenIdFromSever() {
        //携带在地址栏的code信息
        let code = Util.getUrlPara('code'),
            APIUrl = Util.getAPIUrl('get_pay_openid');

        if( !code ) {
            //地址栏里没有code 信息则重定向去微信静默授权
            console.log(' 从服务器上获取用于支付的openId地址栏里没有code 信息则重定向去微信静默授权');
            User.redirectToBaseInfo(true);
            return true;
        }

        userInfo = JSON.parse(localStorage.getItem('user-info'));
        console.log('userInfo'+userInfo);

        let jsonData = JSON.stringify({
            'code': code,
            'unionId': userInfo.unionId
        });

        $.ajax({
            url: APIUrl,//静默授权登录
            data: jsonData,
            type: 'post',
            cache: false,
            contentType: 'application/json;charset=utf-8',
            dataType:'json',
            headers: {
                Accept:"application/json"
            },
            beforeSend: (request) => {
                request.setRequestHeader("X-iChangTou-Json-Api-Token", "DE:_:w2qlJFV@ccOeiq41ENp><ETXh3o@aX8M<[_QOsZ<d8[Yz:NIMcKwpjtBk0e");
            },
            success: (data)=>{
                console.log('从服务器上获取用于支付的openId',data);

                userInfo.payOpenId = data.openId;

                OnFire.fire('OAUTH_SUCCESS',userInfo);

                Loading.hideLoading();
                console.log('userInfo',userInfo);
            },
            error: ()=>{
                User.onGetWxInfoError(true)
            }
        });

    }


    /**
    **
    * 21天获取用户的基本信息
    * nickName
    * portrait
    * bonusPoint
    * @returns {*}
     */

    static getUserProfileFromServer(userId){

        return $.ajax({
            url: Util.getAPIUrl('user_profile'),
            type: 'get',
            cache: false,
            contentType: 'application/json;charset=utf-8',
            dataType:'json',
            headers: {
                Accept:"application/json"
            },
            beforeSend: (request)=>{
                request.setRequestHeader("X-iChangTou-Json-Api-User", userId);
                request.setRequestHeader("X-iChangTou-Json-Api-Token", "DE:_:w2qlJFV@ccOeiq41ENp><ETXh3o@aX8M<[_QOsZ<d8[Yz:NIMcKwpjtBk0e");
            },
            success: (data) => {
               // alert('success data',data);
               // userProfile =data;

            }
        });

    }

    /**
    * 21天报名获取用户信息
    * */

    static getUserProfile(){
        return userProfile
    }


    /**
    * 告诉后台需要增加积分的用户
    * */
    static sentUserIdAddBonus() {

        return $.ajax({
            url: Util.getAPIUrl('add_bonus'),
            type: 'get',
            cache: false,
            contentType: 'application/json;charset=utf-8',
            dataType: 'json',
            headers: {
                Accept: "application/json"
            },
            beforeSend: function(request) {
                request.setRequestHeader("X-iChangTou-Json-Api-Token",
                    "DE:_:w2qlJFV@ccOeiq41ENp><ETXh3o@aX8M<[_QOsZ<d8[Yz:NIMcKwpjtBk0e");

                request.setRequestHeader("X-iChangTou-Json-Api-User", userInfo.userId);

            }
        });
    }


    /**
     * 根据openId，向服务器请求用户详细信息
     * @param openId
     */
    static getUserInfoById(userId, successCallBack, failureCallBack) {
        $.ajax({
            url: Util.getAPIUrl('get_userinfo_byid'),
            type: 'get',
            cache: false,
            contentType: 'application/json;charset=utf-8',
            dataType:'json',
            headers: {
                Accept:"application/json"
            },
            beforeSend: (request)=>{
                request.setRequestHeader("X-iChangTou-Json-Api-User", userId);
                request.setRequestHeader("X-iChangTou-Json-Api-Token", "DE:_:w2qlJFV@ccOeiq41ENp><ETXh3o@aX8M<[_QOsZ<d8[Yz:NIMcKwpjtBk0e");
            },
            success: (data) => {
                successCallBack && successCallBack(data);
            },
            error: (err) => {
                failureCallBack && failureCallBack(err);
            }
        });
    }

    /**
     * 获取微信数据失败
     */
    static onGetWxInfoError(topay) {
        console.log('获取微信数据失败');
        User.redirectToUserinfo(topay);
    }

    /**
     * 初始化为微信的普通API
     */
    static signWxApi() {
        console.log('初始化为微信的普通API');
        let url = JSON.stringify({'url': location.href}),
            me = User;

        $.ajax({
            url: Util.getAPIUrl('wx_sign'),
            data: url,
            type: 'post',
            cache: false,
            contentType: 'application/json;charset=utf-8',
            dataType:'json',
            headers: {
                Accept:"application/json"
            },
            beforeSend: (request)=>{
                request.setRequestHeader("X-iChangTou-Json-Api-Token", "DE:_:w2qlJFV@ccOeiq41ENp><ETXh3o@aX8M<[_QOsZ<d8[Yz:NIMcKwpjtBk0e");
            },
            success: (data) => {
                User.wxdata = data;
                me.wxconfig(data);
            },
            error: () => {

            }
        });
    }

    /**
     * 获取微信数据，包括
     * wechat_appid
     * timestamp
     * nonceStr
     * signature
     * @returns {*}
     */
    static getWxData() {
        return User.wxdata;
    }

    /**
     * 配置微信
     * @param data
     */
    static wxconfig(data) {
        wx.config({
            appId: data.wechat_appid,
            timestamp: data.timestamp,
            nonceStr: data.nonceStr,
            signature: data.signature,
            jsApiList: [
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'onMenuShareQQ',
                'onMenuShareWeibo',
                'chooseWXPay'
            ]
        });

        wx.ready( () => {
            User.shareConfig();
        });
    }

    /**
     * 分享设置
     */
    static shareConfig() {
        let imgUrl = User.getUserInfo().headImage,
            desc = Util.getShareDesc(),
            title = Util.getShareTitle(),
            link = Util.getShareLink();

        if( !imgUrl ) {
            imgUrl = Util.getDomain() + 'build21/shareLogo.png';
        }

        let timelineOpt = {
            title,
            desc,
            link,
            imgUrl,
            success: ()=>{
                Util.onShareSuccess('朋友圈');
            },
            cancel: ()=>{
                Util.onShareFailure('朋友圈');
            }
        }, messageOpt = {
            title,
            desc,
            link,
            imgUrl,
            success: ()=>{
                Util.onShareSuccess('消息');
            },
            cancel: ()=>{
                Util.onShareFailure('消息');
            }
        }, QQOpt = {
            title,
            desc,
            link,
            imgUrl,
            success: ()=>{
                Util.onShareSuccess('QQ');
            },
            cancel: ()=>{
                Util.onShareFailure('QQ');
            }
        }, weiboOpt = {
            title,
            desc,
            link,
            imgUrl,
            success: ()=>{
                Util.onShareSuccess('weibo');
            },
            cancel: ()=>{
                Util.onShareFailure('weibo');
            }
        };

        //QQ的分享链接单独设置（为了能在QQ中打开）
        QQOpt.link = Util.getQQShareLink();

        //朋友圈的分享标题使用通用标题
        timelineOpt.title = Util.getTimelineTitle();

        wx.onMenuShareTimeline(timelineOpt);
        wx.onMenuShareAppMessage(messageOpt);
        wx.onMenuShareQQ(QQOpt);
        wx.onMenuShareWeibo(weiboOpt);
    }

    /**
     * 获取用户等级：
     * 0 ：未付费用户
     * 1 : 已付费用户
     *
     * 获取成功后，如果是VIP用户，则允许其听所有课
     */
    static getUserLevel(successFun, failureFun) {
        let jsonData = JSON.stringify({'minicId': Util.getMinicId()}),
            userInfo = User.getUserInfo();//Minic标示

        return $.ajax({
            url: Util.getAPIUrl('get_userlevel'),
            data: jsonData,
            type: 'post',
            cache: false,
            contentType: 'application/json;charset=utf-8',
            dataType:'json',
            headers: {
                Accept:"application/json"
            },
            beforeSend: function(request) {
                request.setRequestHeader("X-iChangTou-Json-Api-User", userInfo.userId);
                request.setRequestHeader("X-iChangTou-Json-Api-Session", userInfo.sessionId);
                request.setRequestHeader("X-iChangTou-Json-Api-Token", "DE:_:w2qlJFV@ccOeiq41ENp><ETXh3o@aX8M<[_QOsZ<d8[Yz:NIMcKwpjtBk0e");
            }
        })
            .done((data)=>{
                if( data ) {
                    //开通VIP权限
                    //User.setVipUser('已购买课程，可完整学习');
                }else {
                    //还没有开通
                    Config.free && User.openCourse().done(()=>{
                        DoneToast.show('已开通专属课程');
                    });

                    //限时免费中，自动开通课程
                    Config.limitFree && User.openCourse();
                }

                if( data && window.giftPageInstance ){
                    window.giftPageInstance.onVipUser(data);
                    DoneToast.show('你已开通权限');
                    //$('#payHint').html('你已开通权限。可以完整收听。');
                }
                User.setFollowerInfo();

                successFun && successFun(data);
            })
            .fail((err)=>{
                failureFun && failureFun(err);
            });
    }

    /**
     * 设置上下线关系信息(好友)
     */
    static setFollowerInfo() {
        let parentNickName = localStorage.getItem('minic'+Util.getMinicId()+'-giftParent');
        if( parentNickName ){
            $('#follower').html(parentNickName+' 赠予 '+userInfo.nickName);
        }
    }

    /**
     * 刷新
     */
    //static refresh() {
    //    Loading.showLoading('刷新中');
    //
    //
    //
    //    //更新排行榜
    //    RankingList.getRankListFromServer();
    //}




    /**
     * 开通课程
     */
    static openCourse() {
        let apiUrl = Util.getAPIUrl('open_course').replace('minicId', Util.getMinicId());

        if( !userInfo || !userInfo.userId ) {
            return;
        }

        return $.ajax({
            url: apiUrl,
            type: 'get',
            cache: false,
            contentType: 'application/json;charset=utf-8',
            dataType:'json',
            headers: {
                Accept:"application/json"
            },
            beforeSend: function(request) {
                request.setRequestHeader("X-iChangTou-Json-Api-User", userInfo && userInfo.userId);
                request.setRequestHeader("X-iChangTou-Json-Api-Token", "DE:_:w2qlJFV@ccOeiq41ENp><ETXh3o@aX8M<[_QOsZ<d8[Yz:NIMcKwpjtBk0e");
            }
        });
    }

    /**
     * 重定向到微信的静默授权页面
     */
    static redirectToBaseInfo(istopay) {
        if( Util.getDebugFlag() ) {
            return;
        }

        if( !Util.isWeixin() ){
            //QQ中打开不跳转
            return;
        }

        //不带code的话，强制去静默授权
        let redirectUri = Util.getRedirectUri(false,istopay),
            scope = 'snsapi_base';//snsapi_userinfo;


        let url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + Util.getAppId() +
            '&redirect_uri=' + redirectUri +
            '&response_type=code' +
            '&scope=' + scope +
            '&state=minic&connect_redirect=1#wechat_redirect';

        console.log('url'+url);

        window.location.href = url;
    }

    /**
     * 重定向到微信的userInfo授权（会弹出绿色的授权界面）
     */
    static redirectToUserinfo(topay) {
        if( !Util.isWeixin() ){
            //QQ中打开不跳转
            return;
        }

        //不带code的话，强制去静默授权
        let redirectUri = Util.getRedirectUri(true,topay),
            scope = 'snsapi_userinfo';//snsapi_userinfo;


        //记录请求次数，超过3次，则不再请求
        let errCounter = 0;
        if( localStorage.getItem('userInfoErrCounter') ){
            errCounter = parseInt(localStorage.getItem('userInfoErrCounter'));
        }
        if( errCounter > 3 ) {
            localStorage.removeItem('userInfoErrCounter');
            Loading.hideLoading();
            return;
        }else {
            localStorage.setItem('userInfoErrCounter', errCounter+1);
        }

        let url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + Util.getAppId() +
            '&redirect_uri=' + redirectUri +
            '&response_type=code' +
            '&scope=' + scope +
            '&state=minic#wechat_redirect';

        console.log('url'+url);

        location.href = url;
    }

    /**
     * 当前是否处于免费状态
     */
    static isNowFree() {
        if( !Config.limitFree ){
            return false;
        }

        let deadLine = new Date(FREE_DEADLINE),
            nowTime = Date.now(),
            deadLineTime = deadLine.getTime(),
            restTime = deadLineTime - nowTime;

        if( restTime <= 0 ){
            //已经没有剩余免费时间了
            return false;
        }else {
            //毫秒级别的剩余时间
            return restTime;
        }
    }

    /**
     * 完全免费状态
     */
    static onFreeStatus() {
        if( Util.isWeixin() ) {
            $('.share-hint').hide();

            //User.setVipUser('专属免费，可完整听课');
        }
    }

    /**
     * 如果当前处于限时免费状态的话
     */
    static onLimitFreeStatus() {
        let restTime = User.isNowFree();
        if( restTime ){
            ReactDom.render(<p>
                <span className="price" style={{color: '#fff!important;'}}>限时免费</span>
                <span className="original-price">原价{PayController.getCoursePrice().toFixed(2)}</span>
                <br />剩余时间：<span id="restTime"></span>
            </p>, $('#shareDescription')[0]);
        }else {
            return;
        }

        //剩余时间字符串
        let str = Util.millsecToTime(restTime),
            $timeSpan = $('#restTime');

        //倒计时
        $timeSpan.html(str);
        //支付按钮
        //User.setVipUser('限时免费中，可完整听课');

        let timer = setInterval(()=>{
            restTime -= 1000;
            if( restTime <= 0 ){
                clearInterval(timer);
                return;
            }

            str = Util.millsecToTime(restTime);
            $timeSpan.html(str);
        }, 1000);
    }


    /**
     * 绑定上下线关系
     */
    static bindPyramidRelation(openId,sessionId) {

        let apiUrl = Util.getAPIUrl('bind_pyramid_relation');

        let data = JSON.stringify({
            channel: 'minic', //渠道
            childId: openId, //下线OpenId
            parentId: sessionId //上线userId
        });

        return $.ajax({
            url: apiUrl,
            type: 'post',
            data: data,
            cache: false,
            contentType: 'application/json;charset=utf-8',
            dataType:'json',
            headers: {
                Accept:"application/json"
            },
            beforeSend: function(request) {
                //request.setRequestHeader("X-iChangTou-Json-Api-User", userId);
                request.setRequestHeader("X-iChangTou-Json-Api-Token", "DE:_:w2qlJFV@ccOeiq41ENp><ETXh3o@aX8M<[_QOsZ<d8[Yz:NIMcKwpjtBk0e");
            }
        });
    }
}
window.User = User;

module.exports = User;

