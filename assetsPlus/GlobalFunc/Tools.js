/**
 * Created by ichangtou on 2017/5/13
 */
var Material = require('../Material');
// const MyStorage = require('../GlobalFunc/MyStorage');
const GlobalConfig = require('../GlobalStorage/GlobalConfig');
const React = require('react');
const OnFire = require('onfire.js');
const Actions = require('../GlobalStorage/Actions');

class Tools {
    //返回一个get.
    //get为结果 或者 等待结果的promise
    static fireRace(result,eventName,courseId) {
        // let keyWord = eventName;
        // switch(eventName) {
        //     case 'courseStatus':
        //         keyWord = keyWord + courseId;
        //         break;
        //     default:
        //         break;
        // }
        return new Promise((resolve,reject)=>{
            if (result) {
                console.log('get' + result);
                resolve(result);
            } else {
                OnFire.on(eventName, (value)=>{
                    //不要使用这个返回值,只作为回调广播
                    resolve(value);
                })
            }
        })
    }

    //获取课程进度
    static fireRaceCourse(courseId) {
        let keyWord = 'courseStatus';
        keyWord = keyWord + courseId;
        //down
        let payStatus = MyStorage.getCourseStatus(courseId);
        return new Promise((resolve,reject)=>{
            if (payStatus) {
                console.log('get' + payStatus);
                resolve(payStatus);
            } else {
                OnFire.on(keyWord, (value)=>{
                    resolve(value);
                })
            }
        })
    }

    static makeGet(keyWord) {
        return new Promise((resolve,reject)=>{

            keyWord = keyWord + courseId;
            //get
            OnFire.on(keyWord, (value)=>{
                resolve(value);
            })
        })
    }


    static updataCourseData(courseId) {
        let keyWord = 'courseStatus';
        keyWord = keyWord + courseId;
        //down
        let payStatus = MyStorage.getCourseStatus(courseId);
        return new Promise((resolve,reject)=>{
            //这个版本现在actions和get耦合在一起.
            //先试图取值 如果失败 则action ajax
            //action
            console.log('action!!!!!!!!'+ keyWord);
            Actions.ifCourseSignUp(courseId);
            //get
            OnFire.on(keyWord, (value)=>{
                resolve(value);
            })
        })
        // return this.fireRace(payStatus,keyWord,courseId)
    }

    static postData(eventName){
        let where;
        let what;
        let page;
        let strings = [3];
        let result = '';
        // strings[0] = MyStorage.getItem('S','entry');
        strings[1] = eventName;
        strings[2] = 'PayPage';
        for(let i = 0; i<strings.length; i++){
            if(i!==strings.length - 1){
                result = result + strings[i] + '_';
            } else {
                result = result + strings[i]
            }
        }
        Material.postData(result);
    }

    // static LocationHash(pathTo,path) {
        //将跳转改成当前页面
        // let pathFrom = MyStorage.getItem('S','pathNow');
        // if(!pathFrom){
        //     pathFrom = 'ListenCourse';
        // }
        // MyStorage.setItem('S','pathFrom',pathFrom);
        // MyStorage.setItem('S','pathNow',pathTo);
        // location.hash = path;
    // }

    static setCourseUrl(courseId) {
        return GlobalConfig.getCourseInfo(courseId).router;
        // let courseUrl;
        // switch (Number(courseId)) {
        //     case 0:
        //         courseUrl = '/seven';
        //         break;
        //     case 1:
        //         courseUrl = '/fund';
        //         break;
        //     case 2:
        //         courseUrl = '/course21';
        //         break;
        // }
        // return courseUrl;
    }

    static MyRouter(pathTo,pathUrl) {
        let courseId = sessionStorage.getItem('courseId');
        location.hash = this.setCourseUrl(courseId) + pathUrl;
    }
}



module.exports = Tools;