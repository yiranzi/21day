/**
 * Created by ichangtou on 2017/5/13.
 */
var Moveing = false;
var HeightMe = 100;
const Dimensions = require('./Dimensions');

var perTime = 0;
var TotalTime = 0;
var isMoving = false;

var screenHeight = 0;

class AutoMove {
    constructor(perTime,TotalTime) {
        console.log(screenHeight)
        this.screenHeight = Dimensions.getWindowHeight();
        console.log(screenHeight)
        this.perTime = perTime;
        this.TotalTime = TotalTime;
        this.isMoving = false;
    }

    static autoMove() {
        console.log('automove')
    }

    static startMove(divHeight) {
        if(divHeight > this.screenHeight) {
            console.log('move')
        } else {
            console.log('nothing')
        }
    }
}

module.exports = AutoMove;