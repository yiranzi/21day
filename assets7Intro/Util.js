/**
 * 工具类
 * Created by Robot on 2016/7/26
 */
var Group = require('./Group');
var $ = require('jquery');
var React = require('react');
var ReactDom = require('react-dom');

var Config = require('./Config');
var Modal = require('./component/Modal');
var GHGuider = require('./component/GHGuider');
const OnFire = require('onfire.js');


const TEST_APPID = 'wxdd25f06df84b18ea';// //测试环境登录APPID
const FORMA_APPID = 'wx8cc2299282e864f8';//正式环境登录APPID

//todo
const TEST_PAID_APPID = 'wx7cf8dd5d80048e42'; //测试环境支付APPID
const FORMAL_PAID_APPID = 'wxd6c823882698f217'; //正式环境支付APPID


//登录APPID
var APPID = Config.environment ? FORMA_APPID : TEST_APPID;
//测试APPID
var PAID_APPID =  Config.environment ?FORMAL_PAID_APPID : TEST_PAID_APPID;

const FORMAL_API_DOMAIN = 'https://growth.ichangtou.com/';//生产环境 API域名
// const TEST_API_DOMAIN = 'http://devh5.ichangtou.com.cn/';//测试环境 API域名
const TEST_API_DOMAIN = 'https://geek.ichangtou.com/';//测试环境 API域名

const API_URL_DOMAIN = Config.environment ? FORMAL_API_DOMAIN : TEST_API_DOMAIN; //开发环境or生产环境


//API TOKEN
const FORMAL_API_Token = 'DE:_:w2qlJFV@ccOeiq41ENp><ETXh3o@aX8M<[_QOsZ<d8[Yz:NIMcKwpjtBk0e';//生产环境 API Token
const TEST_API_Token = 'XX:_:w2qlJFV@ccOeiq41ENp><ETXh3o@aX8M<[_QOsZ<d8[Yz:NIMcKwpjtBk0e';//测试环境 API Token
const API_Token = Config.environment ? FORMAL_API_Token : TEST_API_Token; //开发环境or生产环境

const MINIC_ID = '7';  //迷你课买房与资产配置课程ID
const MINIC_NAME = '7day'; // 项目名称
const VERSION = '1.1.0'; // TODO roy 项目版本
const CHARGE_INDEX = 0; //收费部分下标（0~N）

const CURRENT_BATCH = 2; //当前期数
const END_TIME = [2017,5,20,21,0,0]; // TODO roy 截止时间，需要和后台同步
const USER_NUMBER = 1300; // TODO roy 活动报名总人数

const NORMAL_PRICE = 9;// TODO roy 上线价格，普通用户
const CHEAP_PRICE = 6;// TODO roy 下线价格，享有的优惠价格

const SHARE_TITLE = '和我一起提高财商吧！';
const SHARE_DESC = '邀请你一起参加7天财商训练营';

//是否是debug
const IS_DEBUG = location.href.indexOf('localhost') > 0;

//API请求url
const API_URL_GROUP = {
    'get_order': 'payment/wx/jsapi/order',  //获取统一订单
    'wx_sign': 'wx/signature', //微信接口签名
    'userinfo_authorization': 'wx/h5/authorization/user-info', //授权注册
    'base_login': 'wx/h5/base/authorization/user-info',//静默登录
    'get_userlevel': 'course/minic/qualification',//是否已购买课程
    'get_follower': 'course/minic/pyramid/construction',//下线数量
    'add_pyramid': 'course/minic/pyramid',  //提交上下线关系
    'get_ranking': 'course/minic/user/rank',  //获取排行榜列表
    'get_native_order': 'payment/wx/native/order',   //微信扫码支付
    'post_present': 'course/minic/present',   //接受赠送
    'get_relation': 'course/minic/user/relation', //请求上下线关系
    'get_userinfo_byid': 'course/minic/user/user-info',   //根据userid请求用户信息
    'open_course': ' course/minic/open/free/minicId',  //主动开通迷你课
    'post_comment': 'course/minic/comment',    //提交评论
    'add_coupon': 'course/minic/coupon',   //添加优惠券
    'push_message': 'wx/message/push', //定向推送消息
    'user_profile':'21eval/user/user-profile',//21天获取用户信息,
    'add_bonus':'21eval/user/recruit',   //21天报名成功
    //奖品
    'get_prize':'21eval/product/products', //奖品列表
    'exchange_prize':'21eval/product/purchase/id', //兑换奖品
    'get_exchange_record':'21eval/product/orders', //兑换记录

    //获取上线信息
    'get_senior_info': '21eval/user/parent-profile',

    //获取支付的openID
    'get_pay_openid': 'wx/h5/base/pay/openId',
    'get_first_share': '21enter/first-share',

    //7day
    'get_registered': '7day/signUpNumber/' + CURRENT_BATCH,//获取报名人数

    //音频
    'get_fmid_info': 'fm/broadcast/{fmId}',
    'get_judge_signup': '7eval/judgeusersignup/{albumId}', //判断用户是否购买
    'get_course_progress': '7day/checkpoint-progress/{checkpointid}', //判断用户关卡进度
    'finish_work': '7day/complete/{type}/{id}', //判断用户关卡进度
    'have_start_lesson': '7day/firstlisten/{fmid}', //判断用户关卡进度
    //用户是否已报名
    'get_judge_signup': '7day/judgeusersignup/' + CURRENT_BATCH, //判断用户是否购买

    //宝箱
    'get_treasure_info': '7day/whetheropengift', //判断用户领了哪些宝箱
    'open_treasure': '7day/opengift', //领取宝箱

    //
    'post_audio_time': 'fm/learn-audio-record', //学习时间和排名
    'get_course_list': '7day/course-list', //学习时间和排名

    //获取进度
    'get_course_finish_rank': '7day/subject-ranking/{userId}/{subjectId}',//获得这一课的排名
    'get_graduated_finish_rank': '7day/graduation/ranking',//获得这一课的排名



};

class Util {

    /**
     * 获取API token
     * @returns {string}
     */
    static getApiToken(){
        return API_Token;
    }

    static getCurrentBatch() {
        return CURRENT_BATCH;
    }

    /**
     * 获取DOMAIN
     * @returns {string}
     */
    static getAPIDomain() {
        return API_URL_DOMAIN;
    }

    /**
     * 获取链接中的参数内容
     * @param key
     * @returns {Array}
     */
    static getUrlPara( key ) {
        var res = window.location.href.split( key + '=' );
        if( res[1] ) {
            res = decodeURIComponent(res[1].split('&')[0]);
        }else {
            res = null;
        }

        return res;
    }

    /**
     * 获取html地址
     * @returns {*}
     */
    static getHtmlUrl() {
      return location.protocol + "//" + location.host + location.pathname;
    }

    /**
     * 获取域名
     * @returns {*}
     */
    static getDomain() {
        return window.location.href.split( 'index'+ Util.getMinicId() +'.html' )[0];
    }

    /**
     * 是否是微信浏览器
     * @returns {boolean}
     */
    static isWeixin() {
        let ua = navigator.userAgent.toLowerCase();
        if( ua.match(/MicroMessenger/i) == 'micromessenger' ) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 是否是QQ浏览器
     * @returns {boolean}
     */
    static isMQQBrowser( ) {
        if( Util.isWeixin() ){
            //如果是微信浏览器，则肯定不是QQ浏览器
            return false;
        }

        let ua = navigator.userAgent;
        if( ua.match(/MQQBrowser/i) == 'MQQBrowser' ) {
            //安卓上
            return true;
        } else if( ua.match(/QQ/i) == 'QQ' ) {
            //IOS端
            return true;
        }
        else {
            return false;
        }
    }

    /**
     * 是否是IPHONE手机
     */
    static isIphone() {
        let ua = navigator.userAgent.toLowerCase();
        return ua.indexOf('iphone') > 0;
    }

    /**
     * 分享成功
     * @param channel
     */
    static onShareSuccess(channel) {
        let User = require('./User');
        let userInfo = User.getUserInfo();
        // TODO 检测用户nickName是否为空并上报
        console.log('userInfo.nickName = '+ userInfo.nickName);
        if(!userInfo.nickName) {
            Util.postCnzzData('分享时用户名为空', 'nickName=' + userInfo.nickName + ';' + 'userId=' + userInfo.userId);
        }

        Util.shareCommonHandler();

        channel = channel || '';
        Util.postCnzzData('分享成功');

        let seniorId = Util.getUrlPara('ictchannel');
        if (seniorId && seniorId != userInfo.userId) {
          Util.postCnzzData('下线分享成功');
        }

        OnFire.fire('SHARE_SUCCESS');
    }

    /**
     * 分享失败
     * @param channel
     */
    static onShareFailure(channel) {
        Util.shareCommonHandler();

        channel = channel || '';
        Util.postCnzzData('分享取消');
    }

    /**
     * 上传统计数据
     * @param eventName  事件名
     * @parma eventParam 事件携带参数
     */
    static postCnzzData(eventName,eventParam){
        try {
            if( _czc && _czc.push ){
                if(eventParam){
                    if(Util.getUrlPara('dingyuehao')){
                        _czc.push(["_trackEvent",Util.getProjectFlag(), eventName,eventParam, Util.getUrlPara('dingyuehao')]);
                    } else if (Util.getUrlPara('promoteFlag')) {
                        _czc.push(["_trackEvent",Util.getProjectFlag(), eventName,eventParam, Util.getUrlPara('promoteFlag')]);
                    } else{
                        _czc.push(["_trackEvent",Util.getProjectFlag(), eventName,eventParam]);
                    }

                }else{
                    if(Util.getUrlPara('dingyuehao')){
                        _czc.push(["_trackEvent",Util.getProjectFlag(), eventName, Util.getUrlPara('dingyuehao')]);
                    } else if (Util.getUrlPara('promoteFlag')) {
                        _czc.push(["_trackEvent",Util.getProjectFlag(), eventName, Util.getUrlPara('promoteFlag')]);
                    } else{
                        _czc.push(["_trackEvent",Util.getProjectFlag(), eventName ]);
                    }
                }

            }
        }catch ( e ) {
            console.log('统计代码错误');
        }

    }

    /**
     * 当前是否为正式环境
     * @returns {boolean}
     */
    static isFormalEnvironment() {
        if(location.href.indexOf('h5.ichangtou.com') > 0){
            return true;
        }else{
            return false;
        }
    }

    /**
     * 获取API地址
     * @param type
     */
    static getAPIUrl(type) {
        return Util.getAPIDomain() + API_URL_GROUP[type];
    }

    /**
     * 获取上线信息
     * 优先取dingyuehao，没有的话，取ictchannle
     * @returns {Array}
     */
    static getIctChannel() {
        return Util.getUrlPara('dingyuehao') || Util.getUrlPara('ictchannel');
    }

    /**
     * 获取分享链接
     * @returns {string|*}
     */
    static getShareLink() {
        let redirectUri = Util.getHtmlUrl(),
            link,
            userInfo = User.getUserInfo() || {};

        //let nickName = userInfo.nickName || {};
        //
        //if( nickName.length > 10 ){
        //    nickName = nickName.substr(0, nickName.length-6);
        //}

        //sharefix

        if(!userInfo.userId){
            redirectUri = redirectUri + '?ictchannel=' + 214;
            console.log('id is 214')
        } else {
            //上线userid
            redirectUri = redirectUri + '?ictchannel=' + userInfo.userId;
        }


        //订阅号
        if(Util.getUrlPara('dingyuehao')){
            redirectUri = redirectUri + '&dingyuehao=' + JSON.parse(Util.getUrlPara('dingyuehao'));
        }

        //班主任id
        if(Util.getUrlPara('teacherid')){
            redirectUri = redirectUri + '&teacherid=' + JSON.parse(Util.getUrlPara('teacherid'));
        }

        //promoteFlag
        if(Util.getUrlPara('promoteFlag')){
            redirectUri = redirectUri + '&promoteFlag=' + Util.getUrlPara('promoteFlag');
        }


        // redirectUri = encodeURIComponent(redirectUri);
        //
        // link = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + Util.getNormalAppId() +
        //     '&redirect_uri=' + redirectUri +
        //     '&response_type=code' +
        //     '&scope=' + 'snsapi_base' +
        //     '&state=minic#wechat_redirect';

        return redirectUri;
    }

    /**
     * 获取分享到QQ的链接
     */
    // static getQQShareLink() {
    //     let userInfo = User.getUserInfo() || {},
    //         link = Util.getHtmlUrl() + '?ictchannel=' + userInfo.userId;
    //     if( Config.gift ) {
    //         link = link + '&ictgift='+ userInfo.userId + '&ictnickname='+userInfo.nickName;
    //     }
    //
    //     return link;
    // }

    /**
     * 获取APPID
     * @returns {string}
     */
    static getAppId() {
        console.log('APPID',APPID);
        return APPID;
    }


    /**
     * 设置
     * @returns {string}
     */
    static getNormalAppId() {
        return  Config.environment ? FORMA_APPID : TEST_APPID
    }

    static getPayOpenId() {
        return PAID_APPID;
    }

    /**
     * 设置APPID
     */
    static setPayAppId(){
        APPID = PAID_APPID;
    }

    /**
     * 是否有可供支付的openId
     * @param result
     * @returns {*}
     */
    static hasPayOpenidForPay(result) {
        if(result){
            return false
        }

        return true;

    }

    /**
     * 获取迷你课ID
     * @returns {number}
     */
    static getMinicId() {
        return MINIC_ID;
    }

    /**
     * 获取迷你课名字
     * @returns {string}
     */
    static getMinicName() {
        return MINIC_NAME;
    }

    /**
     * 获取迷你课名字
     * @returns {string}
     */
    static getProjectFlag() {
        return MINIC_NAME + '_' + VERSION;
    }


    /**
     * 获取分享标题
     * @returns {string}
     */
    static getShareTitle() {
        let nickName = User.getUserInfo().nickName;
        console.log('获取分享标题时nickName:' + nickName);
        // if( Config.gift ) {
        //     return nickName + '送了一个迷你课给你';
        // }else{
            // return nickName + SHARE_TITLE;
        // }

        return SHARE_TITLE;
    }

    /**
     * 获取普通的标题
     * @returns {string}
     */
    static getCommonTitle() {
        return SHARE_TITLE;
    }

    /**
     * 朋友圈分享的标题
     */
    static getTimelineTitle(){
        if( Config.gift ) {
            let nickName = User.getUserInfo().nickName;
            return nickName + '送了一个迷你课给你:《'+ 'Pokemon Go，除了抓精灵，还应该知道这些' +'》。快和我一起看看';
        }else{
            return SHARE_TITLE;
        }
    }

    /**
     * 分享时的通用操作
     */
    static shareCommonHandler() {
        let userInfo = User.getUserInfo();

        //如果用户没有订阅公众号
        //if( !userInfo.subscribe ){
        //
        //    CommonModal.show();
        //
        //}
    }

    /**
     * 获取分享描述
     * @returns {*}
     */
    static getShareDesc() {
        //let userName = User.getUserInfo().nickName || '';
        return SHARE_DESC;
    }

    /**
     * 获取付费下标(0开始)
     * @returns {number}
     */
    static getChargeIndex() {
        return CHARGE_INDEX;
    }

    /**
     * debug状态
     * @returns {boolean}
     */
    static getDebugFlag() {
        return IS_DEBUG;
    }

    /**
     * 毫秒转为字符串
     * @param millsec
     * @returns {*}
     */
    static millsecToTime(millsec){
        if( millsec <= 0 ) {
            return null;
        }else {
            let hourUnit = 1000*60*60,
                miniuteUnit = 1000*60,
                secondUnit = 1000;

            let hour = Math.floor(millsec/hourUnit),
                miniute = Math.floor(millsec%hourUnit/miniuteUnit),
                second = Math.round(millsec%miniuteUnit/secondUnit);

            return hour+'小时'+miniute+'分'+second+'秒';
        }

    }

    /**
     * 获取重定向的uri
     * @returns {string}
     */
    static getRedirectUri(isUserInfo,isToPay) {
        let redirectUri = Util.getHtmlUrl(),
            prefix = '?';


        if( isToPay ) {
            console.log('获取重定向的uri-istopay=1');
            redirectUri = redirectUri  + prefix + 'istopay=1';
            prefix = '&';
        }



        //把订阅号的标记拼接到地址栏中
        //订阅号信息优先
        let dingyuehao;
        if( dingyuehao = JSON.parse(Util.getUrlPara('dingyuehao'))||0 ){
            redirectUri = redirectUri + prefix + 'dingyuehao=' + dingyuehao;
            prefix = '&';
        }

        console.log('promoteFlag = ' + Util.getUrlPara('promoteFlag'));
        let promoteFlag;
        if( promoteFlag = Util.getUrlPara('promoteFlag')){
            redirectUri = redirectUri + prefix + 'promoteFlag=' + promoteFlag;
            prefix = '&';
        }

        //上线userId
        let ictchannel;
        if( ictchannel = Util.getUrlPara('ictchannel') ) {
            //把上线ID拼接到地址栏中
            redirectUri = redirectUri  + prefix + 'ictchannel=' + ictchannel;
            prefix = '&';
        }

        //teacherid班主任ID
        let teacherid;
        if( teacherid = Util.getUrlPara('teacherid') ) {
            //把班主任ID拼接到地址栏中
            redirectUri = redirectUri  + prefix + 'teacherid=' + teacherid;
            prefix = '&';
        }

        //courseId
        let courseId;
        if( courseId = Util.getUrlPara('courseId') ) {
            redirectUri = redirectUri + prefix + 'courseId=' + courseId;
            redirectUri = redirectUri + prefix + 'name=' + Util.getUrlPara('name');
            redirectUri = redirectUri + prefix + 'rank=' + Util.getUrlPara('rank');
            prefix = '&';
        }


        if( isUserInfo ) {
            //区分baseInfo和userInfo
            redirectUri = redirectUri  + prefix + 'isuserinfo=1';
            prefix = '&';
        }

        return encodeURIComponent(redirectUri);
    }

    /**
     * 锁住滚动
     */
    static lockScroll() {
        $('html').addClass('disable-scroll');
    }

    /**
     * 滚动解锁
     */
    static unlockScroll() {
        $('html').removeClass('disable-scroll');
    }


    /**
     * 倒计时
     * @returns {string}
     */
    static FormatTime(year,month,day,hour,minute,second){
        let leftTime = (new Date(year,month-1,day,hour,minute,second)) - (new Date()); //计算剩余的毫秒数

        let days = parseInt(leftTime / 1000 / 60 / 60 / 24 , 10); //计算剩余的天数
        let hours = parseInt(leftTime / 1000 / 60 / 60 % 24 , 10); //计算剩余的小时
        let minutes = parseInt(leftTime / 1000 / 60 % 60, 10);//计算剩余的分钟
        let seconds = parseInt(leftTime / 1000 % 60, 10);//计算剩余的秒数

        // days = this.checkTime(days);
        // hours = this.checkTime(hours);
        // minutes = this.checkTime(minutes);
        // seconds = this.checkTime(seconds);

        return  [days,hours,minutes,seconds]
    }


    // static timeout(years,month,strDates,hours,minutess,seconds){
    //
    //     let date = new Date();
    //     console.log('date',date);
    //     let years = 2017;
    //     let month = 4;
    //     let strDate = 20;
    //     let hours = 15;
    //     let minutes = 55;
    //     let seconds = 0;
    //     let strDates = strDate;
    //     let minutess = minutes+1;
    //     this.setState({
    //         month,
    //         strDates,
    //         years,
    //         hours,
    //         minutess,
    //         seconds,
    //     });
    //     let seperator1 = "-";
    //     let seperator2 = ":";
    //     let months = date.getMonth() + 1;
    //     console.log('month',month);
    //
    //     if(months > 12){
    //         years = years+1;
    //         month = 1;
    //     }else if(months == 1||3||5||7||8||10||12){
    //         if(strDates > 31){
    //             strDates = 1;
    //             month = month+1;
    //         }
    //     }else if (months == 4||6||9||11){
    //         if(strDates > 30){
    //             strDates = 1;
    //             month = month+1;
    //         }
    //     }else {
    //         if (strDates > 29){
    //             strDates = 1;
    //             month = month+1;
    //         }
    //     }
    //     let currentdate = years + seperator1 + month + seperator1 + strDates
    //         + " " + hours + seperator2 + minutess
    //         + seperator2 + seconds;
    //     let newcurrent = date.getFullYear() + seperator1 + months + seperator1 + date.getDate()
    //         + " " + date.getHours() + seperator2 + date.getMinutes()
    //         + seperator2 + date.getSeconds();
    //     console.log('newcurrent',newcurrent);
    //     console.log('currentdate',currentdate);
    //     if (currentdate == newcurrent){
    //         years = date.getFullYear();
    //         month = date.getMonth() + 1;
    //         strDate = date.getDate();
    //         hours = date.getHours();
    //         minutes = date.getMinutes();
    //         seconds = date.getSeconds();
    //         strDates = strDate;
    //         minutess = minutes+1;
    //     }
    //     if (month >= 1 && month <= 9) {
    //         month = "0" + month;
    //     }
    //     if (strDate >= 0 && strDate <= 9) {
    //         strDate = "0" + strDate;
    //     }
    //     return  [years,month,strDates,hours,minutess,seconds]
    // }

    /** 获取截止时间
    */
    static getEndTime() {
        return END_TIME;
    }

    /** 获取活动报名人数
    */
    static getUserNumber() {
        return USER_NUMBER;
    }

    /** 获取普通用户价格
    */
    static getNormalPrice() {
        return NORMAL_PRICE;
    }

    /** 获取优惠用户价格
    */
    static getCheapPrice() {
        return CHEAP_PRICE;
    }

}
window.Util = Util;

module.exports = Util;
