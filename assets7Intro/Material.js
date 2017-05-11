/**
 * Created by Administrator on 16-9-28.
 */
var $ = require('jquery');
var User = require('./User');
var Toast = require('./component/DoneToast');
var PayPage = require('./component/PayPage');
var React = require('react');
const DialogAlert = require('./component/DialogAlert');


//奖品信息
var PRIZE_INFO = [];

//兑换奖品记录
var PRIZE_RECORD = [];

const BACKUP_QQ = [
    {
        QQNum: 'Max后备群1', //QQ群号
        QQLink: 'www.baidu.com', //QQ群链接
        QQCode: 'Max后备群1' //QQ暗号
     },
    {
        QQNum: 'Max后备群2', //QQ群号
        QQLink: 'www.baidu.com', //QQ群链接
        QQCode: 'Max后备群2' //QQ暗号
    },
    {
        QQNum: 'Max后备群3', //QQ群号
        QQLink: 'www.baidu.com', //QQ群链接
        QQCode: 'Max后备群3' //QQ暗号
    }
];

class Material {
    /**
     * 获取链接中的参数内容
     * @param key
     * @returns {Array}
     */
    static getUrlPara( key ) {
        let href = location.href,
            res = href.split( key + '=' );

        if( res[1] ) {
            res = decodeURIComponent(res[1].split('&')[0]);
        }else {
            res = null;
        }
        return res;
    }

    /***
     * 判断是否报名
     * @param albumId
     * @returns {*}
     */
    static getJudgeFromServer() {
        var User = require('./User');
        const Util = require('./Util'),
            apiUrl = Util.getAPIUrl('get_judge_signup');
        let userInfo = User.getUserInfo();
        return $.ajax(
            {
                url: apiUrl,
                type: 'put',
                cache: false,
                contentType: 'application/json;charset=utf-8',
                headers: {
                    Accept: 'application/json'
                },
                beforeSend: (request)=>{
                    request.setRequestHeader("X-iChangTou-Json-Api-Token", Util.getApiToken());
                    request.setRequestHeader("X-iChangTou-Json-Api-User", userInfo.userId);
                }
            }
        )
    }

    /**
     * 获取fm信息
     * @param fmid
     */
    static getFmInfoFromServer(fmid) {
        console.log('fmid');
        var User = require('./User');
        const Util = require('./Util'),
            apiUrl = Util.getAPIUrl('get_fmid_info').replace('{fmId}',fmid);
        return $.ajax(
            {
                url: apiUrl,
                type: 'get',
                cache: false,
                contentType: 'application/json;charset=utf-8',
                headers: {
                    Accept: 'application/json'
                },
                beforeSend: (request)=>{
                    request.setRequestHeader("X-iChangTou-Json-Api-Token", Util.getApiToken());
                    request.setRequestHeader("X-iChangTou-Json-Api-User", User.getUserInfo().userId);
                }
            }
        )
    }

    /**
     * 更新学习时间
     * @param fmid
     * @param duration 秒
     * @returns {*}
     */
    static updateLearningTime() {
        const Util = require('./Util');
        const User = require('./User');

        let userInfo = User.getUserInfo();
        let apiUrl = Util.getAPIUrl('post_audio_time'); //打卡

        let jsonData = JSON.stringify({
            fmid: 0,
        });

        return $.ajax({
            url: apiUrl,
            data: jsonData,
            type: 'post',
            cache: false,
            contentType: 'application/json;charset=utf-8',
            headers: {
                Accept:"application/json"
            },
            beforeSend: function(request) {
                request.setRequestHeader("X-iChangTou-Json-Api-User", userInfo.userId);
                request.setRequestHeader("X-iChangTou-Json-Api-Token", Util.getApiToken());
            }
        });
    }


    /**
     * 获取后备QQ号
     * @returns {*[]}
     */
    static getBackupQQ() {
        return BACKUP_QQ;
    }

    /**
     *  本地获取所有奖品信息
     * @returns {Array}
     */
    static getAllPrize() {
        return PRIZE_INFO;
    }

    /**
     * 服务器获取所有奖品信息
     * @returns {*}
     */
    static getPrizeFromServer(userId) {
        let apiUrl = Util.getAPIUrl('get_prize');

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
                request.setRequestHeader("X-iChangTou-Json-Api-User", userId);
                request.setRequestHeader("X-iChangTou-Json-Api-Token", Util.getApiToken());
            },
            success: (prizeInfo)=>{
                PRIZE_INFO = prizeInfo;
            }
        });
    }


    /**
     *  本地获取产品兑换记录
     * @returns {Array}
     */
    static getPrizeExchangeRecord() {
        return PRIZE_RECORD;
    }

    /**
     *  获取奖品兑换记录
     * @returns {*}
     */
    static getExchangeRecord(userId) {
        let apiUrl = Util.getAPIUrl('get_exchange_record');

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
                request.setRequestHeader("X-iChangTou-Json-Api-User", userId);
                request.setRequestHeader("X-iChangTou-Json-Api-Token", Util.getApiToken());
            },
            success: (prizeRecord)=>{
                //奖品兑换记录
                PRIZE_RECORD = prizeRecord;
            }
        });
    }

    /**
     *  兑换奖品请求
     * @returns {*}
     */
    static postExchangePrize(id) {
        let apiUrl = Util.getAPIUrl('exchange_prize').replace('id',id);

        var User = require('./User');
        let userInfo = User.getUserInfo();

        return $.ajax({
            url: apiUrl,
            type: 'get',
            cache: false,
            contentType: 'application/json;charset=utf-8',
            dataType:'text',
            headers: {
                Accept:"application/json"
            },
            beforeSend: function(request) {
                request.setRequestHeader("X-iChangTou-Json-Api-User", userInfo.userId);
                request.setRequestHeader("X-iChangTou-Json-Api-Token", Util.getApiToken());
            }

        });
    }

    /**
     * 获取上线信息
     * @returns {*}
     */
    static getSeniorInfoFromServer(seniorId) {
        //21eval/user/parent-profile
        let apiUrl = Util.getAPIUrl('get_senior_info');

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
                request.setRequestHeader("X-iChangTou-Json-Api-User", seniorId);
                request.setRequestHeader("X-iChangTou-Json-Api-Token", Util.getApiToken());
            }

        });
    }

    /***
     * 记录下线打开上线的分享链接
     * @param seniorId
     * @param userId
     * @returns {*}
     */
    static postRecordSenior(seniorId,userId) {
        const Util = require('./Util');

        let apiUrl = Util.getAPIUrl('post_record_info').replace("{parentId}",seniorId);

        return $.ajax({
            url: apiUrl,
            type: 'post',
            cache: false,
            contentType: 'application/json;charset=utf-8',
            headers: {
                Accept:"application/json"
            },
            beforeSend: function(request) {
                request.setRequestHeader("X-iChangTou-Json-Api-User", userId);
                request.setRequestHeader("X-iChangTou-Json-Api-Token", Util.getApiToken());
            }
        });
    }

    /**
     * 第一次分享成功
     * @param userId
     * @returns {*}
     */
    static getFirstShare(userId) {
        //21eval/user/parent-profile
        let apiUrl = Util.getAPIUrl('get_first_share');

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
                request.setRequestHeader("X-iChangTou-Json-Api-User", userId);
                request.setRequestHeader("X-iChangTou-Json-Api-Token", Util.getApiToken());
            }

        });
    }

    /**
     * 第一次分享成功后，提示红包
     * 判断是否关注公号
     */
    static alertRedPacketLocation(callback){

        let userInfo =  require('./User').getUserInfo();

        if( Util.isWeixin() && !userInfo.subscribe ){
            //如果在微信端，没有关注公号的话，则弹框提醒关注公号
            window.dialogAlertComp.show('提示',<div><p>小主，多谢您分享，长按二维码关注公号，红包这就送到！</p>
                <img src="./assets21Intro/image/tousha-qrcode.jpg"  className="tousha-qrcode"/></div>,'知道啦',
                ()=>{window.dialogAlertComp.hide();
                    callback();
            },'',false);
        }else{
            // window.dialogAlertComp.show('提示','红包已经在路上，如果好友成功报名，还可获得更多红包哟!','知道啦',()=>{
            //     window.dialogAlertComp.hide();
            // },()=>{},false);

            callback();

        }
    }

    /***
     * 获取报名人数
     * @param albumId
     * @returns {*}
     */
    static getRegistered() {
        const Util = require('./Util');
        const User = require('./User');

        let apiUrl = Util.getAPIUrl('get_registered');

        return $.ajax({
            url: apiUrl,
            type: 'get',
            cache: false,
            contentType: 'application/json;charset=utf-8',
            headers: {
                Accept:"application/json"
            },
            beforeSend: function(request) {
                request.setRequestHeader("X-iChangTou-Json-Api-User", User.getUserInfo().userId);
                request.setRequestHeader("X-iChangTou-Json-Api-Token", Util.getApiToken());
            }
        });
    }

    /***
     * 获得关卡列表
     */
    static getCourseList() {
        const Util = require('./Util');
        const User = require('./User');

        // let userInfo = User.getUserInfo();
        let apiUrl = Util.getAPIUrl('get_course_list');

        return $.ajax({
            url: apiUrl,
            type: 'get',
            cache: false,
            contentType: 'application/json;charset=utf-8',
            headers: {
                Accept:"application/json"
            },
            beforeSend: function(request) {
                request.setRequestHeader("X-iChangTou-Json-Api-User", User.getUserInfo().userId);
                request.setRequestHeader("X-iChangTou-Json-Api-Token", Util.getApiToken());
            }
        });
    }

    /***
     * 获得课程进度和内容
     */
    static getCourseProgress(checkpointid){
        var User = require('./User');
        const Util = require('./Util'),
            apiUrl = Util.getAPIUrl('get_course_progress').replace('{checkpointid}',checkpointid);
        let userInfo = User.getUserInfo();
        return $.ajax(
            {
                url: apiUrl,
                type: 'get',
                cache: false,
                contentType: 'application/json;charset=utf-8',
                headers: {
                    Accept: 'application/json'
                },
                beforeSend: (request)=>{
                    request.setRequestHeader("X-iChangTou-Json-Api-Token", Util.getApiToken());
                    request.setRequestHeader("X-iChangTou-Json-Api-User", userInfo.userId);
                }
            }
        )
    }

    /***
     *上传作业
     */
    static finishWork(type,id){
        var User = require('./User');
        const Util = require('./Util'),
            apiUrl = Util.getAPIUrl('finish_work').replace('{type}',type).replace('{id}',id);
        let userInfo = User.getUserInfo();
        return $.ajax(
            {
                url: apiUrl,
                type: 'put',
                cache: false,
                contentType: 'application/json;charset=utf-8',
                headers: {
                    Accept: 'application/json'
                },
                beforeSend: (request)=>{
                    request.setRequestHeader("X-iChangTou-Json-Api-Token", Util.getApiToken());
                    request.setRequestHeader("X-iChangTou-Json-Api-User", userInfo.userId);
                }
            }
        )
    }

    /***
     *已经听过课
     */
    static haveStartLesson(id){
        var User = require('./User');
        const Util = require('./Util'),
            apiUrl = Util.getAPIUrl('have_start_lesson').replace('{fmid}',id);
        let userInfo = User.getUserInfo();
        return $.ajax(
            {
                url: apiUrl,
                type: 'put',
                cache: false,
                contentType: 'application/json;charset=utf-8',
                headers: {
                    Accept: 'application/json'
                },
                beforeSend: (request)=>{
                    request.setRequestHeader("X-iChangTou-Json-Api-Token", Util.getApiToken());
                    request.setRequestHeader("X-iChangTou-Json-Api-User", userInfo.userId);
                }
            }
        )
    }


}


window.Material = Material;

module.exports = Material;
