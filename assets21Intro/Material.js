/**
 * Created by Administrator on 16-9-28.
 */
var $ = require('jquery');
var User = require('./User');
var Toast = require('./component/DoneToast');
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
     * 获取注册记录
     * @param termId
     * @param userId
     * @returns {*}
     */
    static getRegisterRecord(termId,userId) {

        if(!userId){
            Toast.show('用户未登录，请退出重试');
            return;
        }

        let apiUrl = Util.getAPIUrl('has_registered');

        let data = JSON.stringify({
            termId: termId+''
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
                request.setRequestHeader("X-iChangTou-Json-Api-User", userId);
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
    static alertRedPacketLocation(){

        let userInfo =  require('./User').getUserInfo();

        if( Util.isWeixin() && !userInfo.subscribe ){
            //如果在微信端，没有关注公号的话，则弹框提醒关注公号
            window.dialogAlertComp.show('提示',<div><p>小主，多谢您分享，长按二维码关注公号，红包这就送到！</p>
                <img src="./assets21Intro/image/tousha-qrcode.jpg"  className="tousha-qrcode"/></div>,'知道啦',
                ()=>{window.dialogAlertComp.hide();
            },'',false);
        }else{
            window.dialogAlertComp.show('提示','红包已经在路上，如果好友成功报名，还可获得更多红包哟!','知道啦',()=>{
                window.dialogAlertComp.hide();
            },()=>{},false);

        }
    }

}


window.Material = Material;

module.exports = Material;