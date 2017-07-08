/**
 * Created by ichangtou on 2017/5/13.1
 */
// const Dimensions = require('./Dimensions');
var preMove = 0;
const OnFire = require('onfire.js');

//课程信息
let courseInfo = [];
//课程Id列表
let courseList = [0,1];

class MyStorage {
    constructor() {
        console.log('constructor');
        for(let i = 0; i<courseList.length; i++) {
            courseInfo[courseList[i]] = {};
        }
    }

    static init() {
        console.log('init');
        for(let i = 0; i<courseList.length; i++) {
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

    static setItem(type,key,value){
        switch(type) {
            case 'S':
                sessionStorage.setItem(key,value);
                // if(!getItem(type,key)){
                //     sessionStorage.setItem(key,value);
                // } else {
                //     console.log('已经有数值');
                // }
                break;
        }
    }

    static getItem(type,key){
        switch(type) {
            case 'S':
                return sessionStorage.getItem(key);
                break;
        }
    }
}

module.exports = MyStorage;