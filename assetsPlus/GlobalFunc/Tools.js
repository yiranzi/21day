/**
 * Created by ichangtou on 2017/5/13
 */
var Material = require('../Material');
const MyStorage = require('../GlobalFunc/MyStorage');
const $ = window.$ = require('jquery');
const React = require('react');
const OnFire = require('onfire.js');
const Actions = require('../GlobalStorage/Actions');

class Tools {
    static fireRace(result,eventName,courseId) {
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

    //获取课程进度
    static fireRaceCourse(courseId) {
        let keyWord = 'courseStatus';
        keyWord = keyWord + courseId;
        //down
        let payStatus = MyStorage.getCourseStatus(courseId);
        return new Promise((resolve,reject)=>{
            if (payStatus) {
                resolve(payStatus);
            } else {
                //这个版本现在actions和get耦合在一起.
                //先试图取值 如果失败 则action ajax
                //action
                console.log('action!!!!!!!!'+ keyWord);
                Actions.ifCourseSignUp(courseId);
                //get
                OnFire.on(keyWord, (value)=>{
                    resolve(value);
                })
            }
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
        let courseUrl;
        switch (Number(courseId)) {
            case 0:
                courseUrl = '/seven';
                break;
            case 1:
                courseUrl = '/fund';
                break;
            case 2:
                courseUrl = '/21Intro';
                break;
        }
        return courseUrl;
    }

    static MyRouter(pathTo,pathUrl) {
        let courseId = sessionStorage.getItem('courseId');
        location.hash = this.setCourseUrl(courseId) + pathUrl;
    }
}



module.exports = Tools;