/**
 * Created by ichangtou on 2017/5/13
 */
var Material = require('../Material');
const MyStorage = require('../GlobalFunc/MyStorage');
const $ = window.$ = require('jquery');
const React = require('react');
const OnFire = require('onfire.js');

class Tools {
    static fireRace(result,eventName) {
        return new Promise((resolve,reject)=>{
            if (result) {
                resolve(result);
            } else {
                OnFire.on(eventName, (value)=>{
                    resolve(value);
                })
            }
        })
    }

    //获取课程进度
    static fireRaceCourse(courseId) {
        let keyWord = 'courseStatus';
        keyWord = keyWord + courseId;
        let payStatus = MyStorage.getCourseStatus(courseId);
        return this.fireRace(payStatus,keyWord)
    }

    getCourseStatus() {
        let courseList = this.state.courseList;
        for( let i = 0; i<courseList.length; i++) {




        }
        //首先,这是一个课程列表
        //每个列表关心自己的课程状态
        //让他们分别去获取.fireRace
        //如果拿到的ID是自己的.那么执行逻辑
        //如果不是自己的.那么继续等待
        //或者是保存完所有的之后统一进行
        //因为课程状态没办法精确
    }

    static postData(eventName){
        let where;
        let what;
        let page;
        let strings = [3];
        let result = '';
        strings[0] = MyStorage.getItem('S','entry');
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

    static LocationHash(pathTo,path) {
        //将跳转改成当前页面
        let pathFrom = MyStorage.getItem('S','pathNow');
        if(!pathFrom){
            pathFrom = 'ListenCourse';
        }
        MyStorage.setItem('S','pathFrom',pathFrom);
        MyStorage.setItem('S','pathNow',pathTo);
        location.hash = path;
    }

    static MyRouter(pathTo,pathUrl) {
        let courseId = sessionStorage.getItem('courseId');
        let courseUrl;
        switch (Number(courseId)) {
            case 0:
                courseUrl = '/seven';
                break;
            case 1:
                courseUrl = '/fund';
                break;
        }
        //将跳转改成当前页面
        let pathFrom = sessionStorage.getItem('pathNow');
        MyStorage.setItem('pathFrom',pathFrom);
        MyStorage.setItem('pathNow',pathTo);
        location.hash = courseUrl + pathUrl;
    }
}



module.exports = Tools;