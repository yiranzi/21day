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
        };
    },

    componentWillMount() {
      //设置
        //设置定时器.每个间隔调用一次移动
    },

    move() {
      let posNow = 0;
      let posNext = posNow +
    },

    mouseUp() {
        //1就近滑动

    },

    resetCurrentIndex() {
        //
    },



    render() {
        return(
            <div  className="banner">
                {/*<SwipeView>*/}
                    <div className="banner-container">
                        {this.renderImgSlot()}
                    </div>
                {/*</SwipeView>*/}
            </div>
        )
    },

    renderImgSlot() {
        let arr = [];
        for(let i = 0; i< 3; i++) {
            arr.push(<img src={this.state.containers[i]}/>)
        }
        return arr;
    }
});

module.exports = Banner;

