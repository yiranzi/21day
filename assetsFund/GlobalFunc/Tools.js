/**
 * Created by ichangtou on 2017/5/13.1
 */
var Material = require('../Material');
const MyStorage = require('../GlobalFunc/MyStorage');
const $ = window.$ = require('jquery');
const React = require('react');

class Tools {
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
                result = result + '_';
            }
        }
        Material.postData(strings);
        console.log('data have post' + strings);
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
}



module.exports = Tools;