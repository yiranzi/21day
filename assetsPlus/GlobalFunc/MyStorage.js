/**
 * Created by ichangtou on 2017/5/13.1
 */
// const Dimensions = require('./Dimensions');
var preMove = 0;
const OnFire = require('onfire.js');

//课程信息
let courseInfo = [];
//课程Id列表
let courseList = [0,1,2];

//这里面需要分出来几个
//1做一个全局的常量保存的地方
//2这里面用来保存变量数据.主要就是set和get
//3这里还负责保存后的广播.

class MyStorage {
    static init() {
        console.log('init');
        let max = 0;
        for(let i = 0; i<courseList.length; i++) {
            if(courseList[i]>max) {
                max = courseList[i];
            }
        }
        for(let i = 0; i<max+1; i++) {
            courseInfo[courseList[i]] = {};
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
        courseInfo[courseList[courseId]].dataResult = dataResult;
        // OnFire.fire("courseStatus",{courseId: courseId,status: status});
        OnFire.fire("courseStatus" + courseId,dataResult);
    }

    static getCourseStatus(courseId) {
        console.log('get');
        return courseInfo[courseId].dataResult;
    }

    static getCourseList() {
        return courseList;
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

    static getItem(key){
        return Util.getUrlPara(key);
        // return sessionStorage.getItem(key);
    }

    static setCourseId(courseId) {
        sessionStorage.setItem('courseId',courseId);
        sessionStorage.setItem('ScourseId',courseId);
    }

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
}

module.exports = MyStorage;