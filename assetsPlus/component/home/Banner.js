/**
 * Created by ichangtou on 2017/7/13.
 */
/**
 * Created by yiran on 2017/5/5.
 */
const React = require('react');
const SwipeView = require("../../component/container/SwipeView").default;

const Banner = React.createClass({

    getInitialState: function() {
        return {
            // finishElement: this.props.finishElement,
            // totalElement: this.props.totalElement

            currentIndex: 0,//当前收看的图片ID
            containers: [],//容器中放置的图片Id
            totalImage: [],//全部的图片
            moveClass: '',
            isMoveByHand: false,
            picWidth: 0,
            boolAutoMoving: false,
            direction: 'right',
            numbers: [],
            currentMove: [],
            isMoving: false,

        };
    },

    componentWillMount() {
        this.getWidth();

        //计算出来需要移动的图片
        this.setCurrentMove();
        this.startWaitTimer();

        // this.initNumbers();
        // this.fixNumber();
        // this.setImgSlot();

        // this.startMoveTimer();
        // this.setState({moveClass: 'move-left'})
      //设置
        //设置定时器.每个间隔调用一次移动
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
        this.state.isMoving  = !this.state.isMoving;
        //触发渲染
        this.setState({isMoving: this.state.isMoving});
        //2.打开等待的timer
        this.startWaitTimer()
    },

    bannerAfterWait() {
        this.state.isMoving  = !this.state.isMoving;
        //设置好下一个坐标
        this.setCurrentIndex();
        //计算出来需要移动的图片
        this.setCurrentMove();
        //触发渲染
        this.setState({isMoving: this.state.isMoving});
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



    //设置当前的编号
    setCurrentImgPos() {
        let totalImage = this.props.totalImage;
        let maxIndex = totalImage.length - 1;
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
        for(let i = 0; i< totalImage.length;i++) {
            let result = this.state.numbers[i] + next;
            if(result < -maxIndex) {
                result = 1
            } else if(result > maxIndex) {
                result = -1
            }
            this.state.numbers[i] = result;
        }
        // this.setState({numbers: this.state.numbers});
    },


    // transform: translateZ(0);
    style(index) {
        let result = this.state.currentMove.indexOf(index);
        if(result === -1) {
            return
        }
        result = result - 1;
        let imgWidth = 351;
        if(this.state.isMoving) {
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
                // left: `(${worldPox * imgWidth}%)`,
                // left: (worldPox) * imgWidth,
                transform: `translateX(${result * imgWidth}px)`,
                visibility: 'visible',
            }
        }
    },

    // style={{transform: `translateX(-100%)`}}
    render() {
        return(
            <div id = 'banner' className = "global-banner">
                {/*<SwipeView>*/}
                    <div onClick={this.autoMove} className="banner-container">
                        {this.renderImgSlot()}
                    </div>
                {/*</SwipeView>*/}
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

    // isMoveing() {
    //     let type = this.state.moveType;
    //     let father = document.getElementById('banner');
    //     let imgSlotes = father.getElementsByTagName('img');
    //     switch(type) {
    //         case 'auto':
    //             for(let i = 0; i< imgSlotes.length; i++) {
    //                 imgSlotes
    //             }
    //     }
    // },

    changePlace() {

    }

});

module.exports = Banner;

