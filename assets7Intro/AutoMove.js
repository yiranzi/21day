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

        console.log(screenHeight)
        this.perTime = perTime;
        this.TotalTime = TotalTime;
        this.isMoving = false;
    }

    static autoMove() {
        console.log('automove')
    }

    static startMove(divHeight) {

        let screenHeight = Dimensions.getWindowHeight();
        let perTime = 200;
        let totalTime = 1000;
        let posY = window.pageYOffset;
        let transY = divHeight - (posY + screenHeight)
        if(transY > 0) {
            let preMove = transY/(totalTime/perTime)
            return new Promise(function(resolve,reject){
                setInterval("move(preMove)",perTime)
                setTimeout(function(){
                }, TotalTime);
            })
        } else {
            return new Promise( function(resolve, reject) {

            })
        }
    }

    static move() {
        let nextPos = window.pageYOffset + preMove
        scrollTo(0,nextPos)
    }
}

module.exports = AutoMove;