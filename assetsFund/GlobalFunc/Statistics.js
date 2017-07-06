/**
 * Created by ichangtou on 2017/7/6.
 */

/**
 * Created by ichangtou on 2017/5/13
 */
var Material = require('../Material');
const MyStorage = require('../GlobalFunc/MyStorage');
const $ = window.$ = require('jquery');
const React = require('react');
const OnFire = require('onfire.js');

let paramsType = ['Sictchannel','SgoPath','SgetWhere','SfreeLesson'];

class Statistics {
    static setPathNow(pathNow) {
        let pathOld = sessionStorage.getItem('pathNow');
        if(!pathOld) {
            pathNow = '入口'
        }
        sessionStorage.setItem('pathFrom',pathOld);
        sessionStorage.setItem('pathNow',pathNow);
    }

    static setStaticData() {
        let linkParamsTypes = paramsType;
        for(let i = 0 ;i < linkParamsTypes.length; i++) {
            let getParams = Util.getUrlPara(linkParamsTypes[i]);
            switch (i) {
                case 0:
                    if(getParams) {
                        sessionStorage.setItem(linkParamsTypes[i],getParams);
                        sessionStorage.setItem('userType','下线');
                    } else {
                        sessionStorage.setItem(linkParamsTypes[i],'null');
                        sessionStorage.setItem('userType','上线');
                    }
                    break;
                default:
                    if(getParams) {
                        let title = ['课程','日期'];
                        let arr = [];
                        let result;
                        arr.push(Util.getUrlPara('courseId'));
                        arr.push(Util.getUrlPara('dayId'));
                        for(let i = 0; i<arr.length; i++) {
                            result = result + title[i] + arr[i] + ',';
                        }
                        sessionStorage.setItem(linkParamsTypes[i],result);
                    } else {
                        sessionStorage.setItem(linkParamsTypes[i],'null');
                    }
                    break;
            }
        }
    }

    static add(eventName) {
        //手动加上 版本号 userId 事件名
        //并且用全局保存起来(方案2)
        sessionStorage.setItem('isBuy',result);
    }

    //数据上报
    static  postData(eventName) {
        var User = require('../User');
        const Util = require('../Util'),
            apiUrl = Util.getAPIUrl('post_statistic_data');
        let userInfo = User.getUserInfo();
        let jsonData = JSON.stringify({
            eventName: eventName,
            version: 11,
        });
        // alert(eventName + '/' + userInfo.userId);
        return $.ajax(
            {
                url: apiUrl,
                type: 'post',
                data: jsonData,
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



module.exports = Statistics;

