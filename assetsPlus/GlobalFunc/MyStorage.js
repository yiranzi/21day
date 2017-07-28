/**
 * Created by ichangtou on 2017/5/13.1
 */
// const Dimensions = require('./Dimensions');
const WxConfig = require('../WxConfig');
const OnFire = require('onfire.js');
const GlobalConfig = require('../GlobalStorage/GlobalConfig');


//课程信息
let courseInfo = {};
//课程Id列表
// let courseList = [0,1,2];

//这里面需要分出来几个
//1做一个全局的常量保存的地方
//2这里面用来保存变量数据.主要就是set和get
//3这里还负责保存后的广播.

class MyStorage {
    static init() {
        // let max = 0;
        // for(let i = 0; i<courseList.length; i++) {
        //     if(courseList[i]>max) {
        //         max = courseList[i];
        //     }
        // }
        // for(let i = 0; i<max+1; i++) {
        //     courseInfo[courseList[i]] = {};
        // }

        for(let i = 0; i< GlobalConfig.getCourseIdList().length; i++) {
            courseInfo[i] = {};
        }
    }

    /**
     *  保存数据,并且广播数据
     * @param courseId 课程ID 拼接广播
     * @param status 关于购买的数据 .pay是是否支付
     */

    static setCourseStatus(courseId,dataResult) {
        console.log('set');
        //保存到全局
        courseInfo[courseId].dataResult = dataResult;
        // OnFire.fire("courseStatus",{courseId: courseId,status: status});
        //报名成功后触发
        if(parseInt(sessionStorage.getItem('courseId')) === courseId) {
            if(dataResult.pay){
                sessionStorage.setItem('SisBuy','付费');
            } else {
                sessionStorage.setItem('SisBuy','未付费');
            }

        }
        OnFire.fire("courseStatus" + courseId,dataResult);
    }

    static getCourseStatus(courseId) {
        return courseInfo[courseId].dataResult;
    }

    static deleteCourseStatus(courseId) {
        if(courseInfo[courseId]) {
            courseInfo[courseId].dataResult = null;
        } else {
            console.log('error' + 'deleteCourseStatus');
        }
    }



    static setItem(key,value){
        console.log('read-only')
        // sessionStorage.setItem(key,value);
        // if(!getItem(type,key)){
        //     sessionStorage.setItem(key,value);
        // } else {
        //     console.log('已经有数值');
        // }
    }


    /**
     * 传入全局变量名称
     * 返回值
     * 封装了set/get
     * @param key
     * @returns {Array}
     */
    static getItem(key){
        return Util.getUrlPara(key);
        // return sessionStorage.getItem(key);
    }

    //需要修改的全局变量.
    //并且需要上报.

    /**
     * 设置当前的课程ID
     * @param courseId
     */
    static setCourseId(courseId) {
        sessionStorage.setItem('courseId',courseId);
        sessionStorage.setItem('ScourseId',courseId);
    }

    /**
     * 设定当前界面名称.
     * @param pathNow
     */
    static setPathNow(pathNow) {
        let pathOld = sessionStorage.getItem('pathNow');
        if(!pathOld) {
            pathOld = '入口文件'
        }
        sessionStorage.setItem('pathFrom',pathOld);
        sessionStorage.setItem('pathNow',pathNow);
        sessionStorage.setItem('SpathFrom',pathOld);
        sessionStorage.setItem('SpathNow',pathNow);
    }

    /**
     * 进入界面调用函数
     * @param pathNow 界面名称
     */
    static whenEnterPage(pathNow) {
        console.log('你进入了' + pathNow);
        this.setPathNow(pathNow);
        Statistics.postDplusData('进入界面');
    }
}

// module.exports = MyStorage;
window.MyStorage = MyStorage;