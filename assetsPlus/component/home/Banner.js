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

        };
    },

    componentWillMount() {
        this.getWidth();
        this.setImgSlot();

        this.startTimer();
        // this.setState({moveClass: 'move-left'})
      //设置
        //设置定时器.每个间隔调用一次移动
    },

    getWidth() {
        // document.getElementById('need-draw');
        this.state.picWidth = 351;
    },

    startTimer() {
        //如果要移动
        if(this.state.boolAutoMoving) {
            setTimeout(this.bannerChange.bind(this), 2100);
        } else {
            setTimeout(this.bannerChange.bind(this), 1000);
        }

    },

    clearTimer() {
        if(this.state.boolAutoMoving) {
            window.clearInterval(bannerTimer);
        } else {
            window.clearInterval(bannerTimer);
        }
    },

    bannerChange() {
        //如果正在移动.
        if(this.state.boolAutoMoving) {
            //停止移动后
            this.state.boolAutoMoving  = !this.state.boolAutoMoving;
            //1计算将谁的位置调整/换图
            //2.打开等待的timer
            this.startTimer()
        } else {

        }
    },


    move() {
      let posNow = 0;
      // let posNext = posNow +
    },

    mouseUp() {
        //1就近滑动

    },

    resetCurrentIndex() {
        //
    },

    //设置各个img曹的图片内容
    setImgSlot() {
        let totalImage = this.props.totalImage;
        let maxIndex = totalImage.length - 1;
        let currentIndex = this.state.currentIndex;

        let slotLeft = currentIndex - 1 < 0 ? maxIndex : currentIndex - 1;
        let slotRight = currentIndex + 1 > maxIndex ? 0 : currentIndex + 1;
        let arr = [];
        arr.push(totalImage[slotLeft]);
        arr.push(totalImage[currentIndex]);
        arr.push(totalImage[slotRight]);
        this.state.containers = arr;
        this.setState({containers: this.state.containers});
    },

    style(index) {
        console.log('set');
        let worldPox = 0;
        worldPox = worldPox + index - this.state.currentIndex;
        if(worldPox === 2) {
            worldPox = -1;
        } else if(worldPox === -2) {
            worldPox = 1;
        }
        let imgWidth = 351;
        let next = 0;
        switch (this.state.direction) {
            case 'left':
                next = 1;
                break;
            case 'right':
                next = -1;
                break;
        }
        // this.state.currentIndex = this.state.currentIndex + next;
        if(!this.state.boolAutoMoving) {
            return {
                // left: `(${worldPox * imgWidth}%)`,
                left: worldPox * imgWidth,
            }
        } else {
            return {
                // left: `(${worldPox * imgWidth}%)`,
                left: (worldPox + next) * imgWidth,
                transition: 'left 2s'
            }
        }

        return {
            // transform: `translateX(-${100 * this.props.index}%)`,
            transform: `translateX(-100%)`,
            transition: 'transform 5s'
        };
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

    autoMove() {
        console.log('123');
        let result = this.state.boolAutoMoving;
        this.setState({boolAutoMoving: !result})
    },

    renderImgSlot() {
        let arr = [];
        for(let i = 0; i< 3; i++) {
            arr.push(<img style={this.style(i)} src={this.state.containers[i]}/>);
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

