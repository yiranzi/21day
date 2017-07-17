/**
 * Created by ichangtou on 2017/7/13.
 */
/**
 * Created by yiran on 2017/5/5.
 */
const React = require('react');
const SwipeView = require("../../component/container/SwipeView").default;

let initPos = 0;

const Banner = React.createClass({

    getInitialState: function() {
        return {
            currentIndex: 0,//当前收看的图片ID
            totalImage: [],//全部的图片
            isMoveByHand: false,
            picWidth: 0,
            boolAutoMoving: false,
            direction: 'right',
            currentMove: [],
            isAutoMoving: false,
            isMoveByHand: false,
            currentPos: 0,

        };
    },

    componentWillMount() {
        this.getWidth();
        //计算出来需要移动的图片
        this.setCurrentMove();
        this.startWaitTimer();
    },



    setCurrentMove() {
        let currentIndex = this.state.currentIndex;
        if(currentIndex === 0) {
            this.state.currentMove[0] = this.props.totalImage.length - 1;
            this.state.currentMove[1] = currentIndex;
            this.state.currentMove[2] = currentIndex + 1;
        } else if (currentIndex === this.props.totalImage.length - 1) {
            this.state.currentMove[0] = currentIndex - 1;
            this.state.currentMove[1] = currentIndex;
            this.state.currentMove[2] = 0
        } else {
            this.state.currentMove[0] = currentIndex - 1;
            this.state.currentMove[1] = currentIndex;
            this.state.currentMove[2] = currentIndex + 1;
        }
        // this.setState({currentMove: this.state.currentMove});
    },

    getWidth() {
        // document.getElementById('need-draw');
        this.state.picWidth = 351;
    },

    autoMove() {
        // if(!this.state.boolAutoMoving) {
        //     this.bannerAfterMove();
        // } else {
        //     this.bannerAfterWait();
        // }
    },

    startMoveTimer() {
        //如果要移动
        // this.setState({boolAutoMoving: true});
        setTimeout(this.bannerAfterMove.bind(this), 2600);
    },

    startWaitTimer() {
        // this.setState({boolAutoMoving: false});
        setTimeout(this.bannerAfterWait.bind(this), 1000);
    },

    bannerAfterMove() {
        console.log('移动完毕,等待中');
        //停止移动后
        this.state.isAutoMoving  = !this.state.isAutoMoving;
        //触发渲染
        this.setState({isAutoMoving: this.state.isAutoMoving});
        //2.打开等待的timer
        this.startWaitTimer()
    },

    bannerAfterWait() {
        this.state.isAutoMoving  = !this.state.isAutoMoving;
        //设置好下一个坐标
        this.setCurrentIndex();
        //计算出来需要移动的图片
        this.setCurrentMove();
        //触发渲染
        this.setState({isAutoMoving: this.state.isAutoMoving});
        //开始move的timer
        this.startMoveTimer();

    },

    //设置当前的编号
    setCurrentIndex() {
        let totalImage = this.props.totalImage;
        let maxIndex = totalImage.length - 1;
        let currentIndex = this.state.currentIndex;
        let next = 0;
        //如果要移动
        switch (this.state.direction) {
            case 'left':
                next = -1;
                break;
            case 'right':
                next = 1;
                break;
        }

        currentIndex = currentIndex + next;
        if(currentIndex < 0) {
            currentIndex = maxIndex
        } else if(currentIndex > maxIndex) {
            currentIndex = 0
        }
        console.log(currentIndex);
        this.state.currentIndex = currentIndex;
    },


    // transform: translateZ(0);
    // style={{transform: `translateX(-100%)`}}
    style(index) {
        let result = this.state.currentMove.indexOf(index);
        if(result === -1) {
            return
        }
        result = result - 1;
        let imgWidth = 351;
        if(this.state.isAutoMoving) {
            //自动移动.
            let hiddenIndex = 0;
            if(this.state.direction === 'right') {
                hiddenIndex = 1;
            } else {
                hiddenIndex = -1;
            }
            if(result!=hiddenIndex) {
                return {
                    // left: worldPox * imgWidth,
                    // transition: 'left 2s'
                    transition: 'transform 2s linear',
                    transform: `translateX(${result * imgWidth}px)`,
                    visibility: 'visible',
                    // transform: `translateX(${worldPox}00%)`
                }
            } else {
                return {
                    visibility: 'hidden',
                }
            }
        } else {
            if(!this.state.isMoveByHand) {
                //等待状态
                return {
                    // left: `(${worldPox * imgWidth}%)`,
                    // left: (worldPox) * imgWidth,
                    transform: `translateX(${result * imgWidth}px)`,
                    visibility: 'visible',
                }
            } else {
                //手动移动
                return {
                    // left: `(${worldPox * imgWidth}%)`,
                    // left: (worldPox) * imgWidth,
                    transform: `translateX(${result * imgWidth + this.state.currentPos}px)`,
                    visibility: 'visible',
                }
            }

        }
    },

    cbfPress(e, deltaX, deltaY, absX, absY, velocity) {
        console.log('moving' + deltaX);
        //如果当前在等待状态中.并且非手动操作
        if (!this.state.isAutoMoving && !this.state.isMoveByHand) {
            //修改操作模式
            this.state.isMoveByHand = true;
            //关闭timer

            //记录初始位置.
            initPos = 0;
            //开始捕捉滑动

        }
    },

    cbfMoving(e, deltaX, deltaY, absX, absY, velocity) {
        // console.log('moving' + deltaX);
        //如果是手动模式.

        //设置好方向.

        //计算好加速度.
    },

    cbfPutOn() {
        //如果是手动模式
        if(!this.state.isMoveByHand) {
            return;
        }
        //关闭手动,打开
        this.state.isMoveByHand = false;
        this.bannerAfterWait();
        //
    },

    render() {
        return(
            <div id = 'banner' className = "global-banner">
                {/*<SwipeView/>*/}
                <SwipeView className="banner-container" onSwiping = {this.cbfMoving} onSwiped = {this.cbfPress} >
                    <div onClick={this.autoMove} >
                        {this.renderImgSlot()}
                    </div>
                </SwipeView>
            </div>
        )
    },

    renderImgSlot() {
        let imgs = this.props.totalImage;
        let arr = [];
        for(let i = 0; i < imgs.length; i++) {
            arr.push(<img style={this.style(i)} src={imgs[i]}/>);
        }
        return arr;
    },
});

module.exports = Banner;

