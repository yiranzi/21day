/**
 * Created by ichangtou on 2017/5/13.1
 */
// const Dimensions = require('./Dimensions');
var preMove = 0;
const OnFire = require('onfire.js');

class MyStorage {
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