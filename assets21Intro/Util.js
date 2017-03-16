

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

const FORMAL_API_DOMAIN = 'https://m.ichangtou.com/';//生产环境 API域名
const TEST_API_DOMAIN = 'http://devh5.ichangtou.com.cn/';//测试环境 API域名

const API_URL_DOMAIN = Config.environment ? FORMAL_API_DOMAIN : TEST_API_DOMAIN; //开发环境or生产环境


//API TOKEN
const FORMAL_API_Token = 'DE:_:w2qlJFV@ccOeiq41ENp><ETXh3o@aX8M<[_QOsZ<d8[Yz:NIMcKwpjtBk0e';//生产环境 API Token
const TEST_API_Token = 'XX:_:w2qlJFV@ccOeiq41ENp><ETXh3o@aX8M<[_QOsZ<d8[Yz:NIMcKwpjtBk0e';//测试环境 API Token
const API_Token = Config.environment ? FORMAL_API_Token : TEST_API_Token; //开发环境or生产环境



const MINIC_ID = '21';  //迷你课买房与资产配置课程ID
const MINIC_NAME = '21天训练营报名'; //迷你课课程名称  英国脱欧
const CHARGE_INDEX = 0; //收费部分下标（0~N）

const CURRENT_BATCH = 23; //当前期数 TODO

const SHARE_TITLE = '邀请你一起参加21天小白理财训练营';

const SHARE_DESC = '你和富人之间，只差一个训练营';

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

    //绑定上下线关系
    'bind_pyramid_relation': '21eval/user/add-child',
    //用户是否已报名
    'has_registered': '21enter/is-entered',
    //获取上线信息
    'get_senior_info': '21eval/user/parent-profile',
    //获取支付的openID
    'get_pay_openid': 'wx/h5/base/pay/openId',
    'get_first_share': '21enter/first-share'
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
        return location.href.split('?')[0];
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
        Util.shareCommonHandler();

        channel = channel || '';
        Util.postCnzzData('分享成功');

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
                        _czc.push(["_trackEvent",Util.getMinicName(), eventName, Util.getUrlPara('dingyuehao')]);
                    }else{
                        _czc.push(["_trackEvent",Util.getMinicName(), eventName]);
                    }

                }else{
                    if(Util.getUrlPara('dingyuehao')){
                        _czc.push(["_trackEvent",Util.getMinicName(), eventName,eventParam, Util.getUrlPara('dingyuehao')]);
                    }else{
                        _czc.push(["_trackEvent",Util.getMinicName(), eventName ,eventParam]);
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

        //上线userid
        redirectUri = redirectUri + '?ictchannel=' + userInfo.userId;

        //订阅号
        if(Util.getUrlPara('dingyuehao')){
            redirectUri = redirectUri + '&dingyuehao=' + JSON.parse(Util.getUrlPara('dingyuehao'));
        }

        //班主任id
        if(Util.getUrlPara('teacherid')){
            redirectUri = redirectUri + '&teacherid=' + JSON.parse(Util.getUrlPara('teacherid'));
        }


        redirectUri = encodeURIComponent(redirectUri);

        link = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + Util.getNormalAppId() +
            '&redirect_uri=' + redirectUri +
            '&response_type=code' +
            '&scope=' + 'snsapi_base' +
            '&state=minic#wechat_redirect';

        return link;
    }

    /**
     * 获取分享到QQ的链接
     */
    static getQQShareLink() {
        let userInfo = User.getUserInfo() || {},
            link = Util.getHtmlUrl() + '?ictchannel=' + userInfo.userId;
        if( Config.gift ) {
            link = link + '&ictgift='+ userInfo.userId + '&ictnickname='+userInfo.nickName;
        }

        return link;
    }

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
     * 获取分享标题
     * @returns {string}
     */
    static getShareTitle() {
        let nickName = User.getUserInfo().nickName;
        if( Config.gift ) {
            return nickName + '送了一个迷你课给你';
        }else{
            return nickName + SHARE_TITLE;
        }
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

}
window.Util = Util;

module.exports = Util;