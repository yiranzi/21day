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

const Tools = require('../GlobalFunc/Tools');

//统计参数(不计算进入逻辑,不截取参数,仅仅是为了统计)
const paramStatictics = ['ScourseIdOrigin','SpathFrom','SpathNow','SstartTime'];

//super 当改变的时候需要同时更新逻辑/数据统计
const superStatictics = ['ScourseId','SpathFrom','SpathNow','SisBuy'];

//逻辑参数(不计入统计,仅仅为了逻辑,需要截取)
const paramCalc = ['name','rank'];
//都包括(需要截取,截取后分别保存在逻辑和统计)
const paramsAll = ['courseId','teacherid','dingyuehao','ictchannel','goPath','getWhere','freeLesson','dayId'];

//数据统计变量
let saveStaParams = [];

//课程id
class Statistics {
    static setPathNow(pathNow) {
        let pathOld = sessionStorage.getItem('pathNow');
        if(!pathOld) {
            pathOld = '入口文件'
        }
        sessionStorage.setItem('pathFrom',pathOld);
        sessionStorage.setItem('pathNow',pathNow);
        sessionStorage.setItem('SpathFrom',pathOld);
        sessionStorage.setItem('SpathNow',pathNow);
        console.log('SpathFromSpathFrom');
    }

    static defaultStatic(param,getParams) {
        if(getParams) {
            //添加逻辑
            sessionStorage.setItem(param,getParams);
            //添加数据统计
            sessionStorage.setItem('S'+param,getParams);
        } else {
            sessionStorage.setItem('S'+param,'常规');
        }
    }


    static setStaticData() {
        //1记录所有的逻辑变量
        for(let i = 0 ;i < paramCalc.length; i++) {
            let param = paramCalc[i];
            let getParams = Util.getUrlPara(param);
            sessionStorage.setItem(param,getParams);
        }
        //2记录所有的统计变量
        for(let i = 0 ;i < paramStatictics.length; i++) {
            let param = paramStatictics[i];
            let getParams;
            saveStaParams.push(param);
            switch (param) {
                case 'ScourseIdOrigin':
                    getParams = Util.getUrlPara('courseId');
                    if (getParams) {
                        sessionStorage.setItem(param, getParams);
                    } else {
                        // sessionStorage.setItem(paramsSaveType[i],'null');
                        sessionStorage.setItem(param, '常规');
                    }
                    break;
                default:
                    break;
            }
        }
        //3记录所有的共有变量
        for(let i = 0 ;i < paramsAll.length; i++) {
            let param = paramsAll[i];
            let getParams = Util.getUrlPara(param);
            saveStaParams.push('S'+param);
            switch (getParams) {
                case 'ictchannel':
                    if(getParams) {
                        sessionStorage.setItem(param,getParams);
                        sessionStorage.setItem('S'+param,'下线');
                    } else {
                        // sessionStorage.setItem(paramsSaveType[i],'null');
                        sessionStorage.setItem('S'+param,'常规');
                    }
                    break;
                case 'goPath':// 着陆页
                    this.defaultStatic(param,getParams);
                    break;
                case 'getWhere':// 渠道标记
                    this.defaultStatic(param,getParams);
                    break;
                default:
                    this.defaultStatic(param,getParams);
                    // console.log('unSave' + param);
                    break;
                    // if(getParams) {
                    //     let title = ['课程','日期'];
                    //     let arr = [];
                    //     let result;
                    //     arr.push(Util.getUrlPara('courseId'));
                    //     arr.push(Util.getUrlPara('dayId'));
                    //     for(let i = 0; i<arr.length; i++) {
                    //         result = result + title[i] + arr[i] + ',';
                    //     }
                    //     sessionStorage.setItem(linkParamsTypes[i],result);
                    // } else {
                    //     sessionStorage.setItem(linkParamsTypes[i],'null');
                    // }
                    break;
            }
        }
        //设置
        for (let i = 0;i< saveStaParams.length; i++) {
            let key = saveStaParams[i];
            let value = sessionStorage.getItem(key);
            window.dplus.register({key: value});
            console.log('设置了' + key + value);
        }
    }

    /**
     *  设置变化的的全局
     * @constructor
     */
    static GlobalStatis() {
        for (let i = 0;i< superStatictics.length; i++) {
            let key = superStatictics[i];
            let value = sessionStorage.getItem(key);
            window.dplus.register({key: value});
        }
    }


    static postDplusData(eventName,data) {
        let userId = User.getUserInfo().userId;
        Tools.fireRace(userId,"OAUTH_SUCCESS").then(()=>{
            console.log('hava post DPlus ' + eventName);
            this.GlobalStatis();
            dplus.track(eventName,data)
        });
    }

    static add(eventName) {
        //手动加上 版本号 userId 事件名
        //并且用全局保存起来(方案2)
        sessionStorage.setItem('isBuy',result);
    }

    //数据上报
    static postData(eventName) {
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


window.Statistics = Statistics;
module.exports = Statistics;


