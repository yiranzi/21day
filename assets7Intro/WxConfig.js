/**
 * Created by lip on 2016/7/20.
 */

var $ = require('jquery');
var Util = require('./Util');
var OnFire= require('onfire.js');
var shareConfigFlag = true;

class WxConfig {
    /**
     * 初始化微信配置
     */
    static initWxConfig() {
        Util.isWeixin() && WxConfig.signWxApi().done(WxConfig.wxconfig);
    }

    /**
     * 初始化为微信的普通API
     */
    static signWxApi() {
        let url = JSON.stringify({'url': location.href});

        return $.ajax({
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
                request.setRequestHeader("X-iChangTou-Json-Api-Token", Util.getApiToken());
            }
        });
    }

    /**
     * 配置微信
     * @param data
     */
    static wxconfig(data) {
        data = data || {};
        wx.config({
            //debug: true,
            appId: data.wechat_appid,
            timestamp: data.timestamp,
            nonceStr: data.nonceStr,
            signature: data.signature,
            jsApiList: [
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'onMenuShareQQ',
                'onMenuShareWeibo'
            ]
        });

        wx.ready( () => {
            //WxConfig.shareConfig();
            OnFire.fire('WX_SIGN_SUCCESS');
        });
    }

    /**
     * 分享配置
     */
    static shareConfig(title, desc,fmid,link) {

        //console.log('分享配置',title, desc,fmid,link);
        //if(!shareConfigFlag){
        //    console.log('return  whatever');
        //    return;
        //}

        let imgUrl = User.getUserInfo().headImage || User.getLocalUserInfo()&& User.getLocalUserInfo().headImage;

        link = link || Util.getCurrentUrl()+'?fmid='+fmid;
        desc = desc || Util.getShareDesc();
        title = title || Util.getShareTitle();

        if( !imgUrl ) {
            imgUrl =  'http://h5test.ichangtou.com.cn/minicfm/build/shareLogo.png';
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

        wx.onMenuShareTimeline(timelineOpt);
        wx.onMenuShareAppMessage(messageOpt);
        wx.onMenuShareQQ(QQOpt);
        wx.onMenuShareWeibo(weiboOpt);

        shareConfigFlag = false;
    }
}
module.exports = WxConfig;
