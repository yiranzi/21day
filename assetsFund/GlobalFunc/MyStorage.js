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
                sessionStorage.setItem(key,value)
        }
    }

    static getItem(type,key,value){
        switch(type) {
            case 'S':
                sessionStorage.getItem(key)
        }
    }
}

module.exports = MyStorage;