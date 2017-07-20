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

    static setCourseStatus(courseId,status) {
        console.log('set');
        courseInfo[courseList[courseId]].payStatus = status;
        // OnFire.fire("courseStatus",{courseId: courseId,status: status});
        OnFire.fire("courseStatus" + courseId,status);
    }

    static getCourseStatus(courseId) {
        console.log('get');
        return courseInfo[courseId].payStatus;
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
}

module.exports = MyStorage;