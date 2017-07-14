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

        };
    },

    componentWillMount() {
        this.getWidth();
        this.initNumbers();
        this.fixNumber();
        // this.setImgSlot();

        this.startMoveTimer();
        // this.setState({moveClass: 'move-left'})
      //设置
        //设置定时器.每个间隔调用一次移动
    },

    initNumbers() {
        for(let i = 0;i < this.props.totalImage.length; i++) {
            this.state.numbers[i] = i;
        }
    },

    fixNumber() {
        let totalImage = this.props.totalImage;
        let maxIndex = totalImage.length - 2;
        for(let i = 0; i < this.state.numbers.length; i++) {
            let result = this.state.numbers[i];
                if(result < -maxIndex) {
                    result = 1
                } else if(result > maxIndex) {
                    result = -1
                }
                this.state.numbers[i] = result;
            }
        this.setState({numbers: this.state.numbers});
    },

    addNumber() {
        let totalImage = this.props.totalImage;
        let next = 0;
        for(let i = 0; i < this.state.numbers.length; i++) {
            switch (this.state.direction) {
                case 'left':
                    next = -1;
                    break;
                case 'right':
                    next = 1;
                    break;
            }
            this.state.numbers[i] = this.state.numbers[i] + 1;
        }
        this.setState({numbers: this.state.numbers});
    },


    getWidth() {
        // document.getElementById('need-draw');
        this.state.picWidth = 351;
    },

    startMoveTimer() {
        //如果要移动
        // this.setState({boolAutoMoving: true});
        setTimeout(this.bannerAfterMove.bind(this), 2100);
    },

    startWaitTimer() {
        // this.setState({boolAutoMoving: false});
        setTimeout(this.bannerAfterWait.bind(this), 1000);
    },

    bannerAfterMove() {
        console.log('移动完毕,等待中');
        //停止移动后
        this.state.boolAutoMoving  = !this.state.boolAutoMoving;
        //1计算将谁的位置调整/换图
        this.setCurrentIndex();
        console.log('移动前');
        console.log(this.state.numbers);
        this.fixNumber();
        // this.setCurrentImgPos();
        console.log('移动后');
        console.log(this.state.numbers);
        //2.打开等待的timer
        this.startWaitTimer()
    },

    bannerAfterWait() {
        this.state.boolAutoMoving  = !this.state.boolAutoMoving;
        this.startMoveTimer();
        this.addNumber();
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
        this.setState({currentIndex: currentIndex});
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
        this.setState({numbers: this.state.numbers});
    },

    style(index) {
        console.log('set');
        let worldPox = this.state.numbers[index];
        console.log(worldPox);

        let imgWidth = 351;
        // this.state.currentIndex = this.state.currentIndex + next;
        if(!this.state.boolAutoMoving) {
            return {
                // left: `(${worldPox * imgWidth}%)`,
                transition: 'left 2s',
                left: worldPox * imgWidth,
            }
        } else {
            return {
                // left: `(${worldPox * imgWidth}%)`,
                left: (worldPox) * imgWidth,
                // transition: 'left 2s'
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
        this.setCurrentIndex();
        this.setState({boolAutoMoving: !result})
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

