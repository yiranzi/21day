/**
 * Created by yiran1 on 2017/5/5.
 */
const $ = window.$ = require('jquery');
const React = require('react');
const Dimensions = require('../../Dimensions');

const GetReward = React.createClass({
    getInitialState: function() {

        return {
            content: this.props.content,
            lockPic: [
                "./assets7Intro/image/course/card_1.png",
                "./assets7Intro/image/course/card_2.png",
                "./assets7Intro/image/course/card_3.png",
                "./assets7Intro/image/course/card_4.png",
                "./assets7Intro/image/course/card_5.png",
                "./assets7Intro/image/course/card_6.png",
                "./assets7Intro/image/course/card_7.png",
            ],
        };
    },

    componentWillMount() {
        let lessonId = this.props.params.lessonId;
        console.log(lessonId)
    },


//<p className="reward-recommand" onClick={this.goCommand()}>1231211231</p>
    handleClick() {
        location.hash = "/select";
    },
    // style = {fullbg}
    render() {
        return(
            <div className="get-reward" style = {{backgroundImage: 'url("./assets7Intro/image/course/bg_1.png")',width: Dimensions.getWindowWidth(), height: Dimensions.getWindowHeight()}}  >
                <img className="rewar-light" onClick={this.handleClick} src={'./assets7Intro/image/course/bglight.png'}/>
                <img className="reward-pic" onClick={this.handleClick} src={this.state.lockPic[this.props.params.lessonId - 1]}/>
                <img className="reward-recommand" onClick = {this.goCommand} src={'./assets7Intro/image/course/recommand.png'}/>
            </div>
        )
    },

    goCommand() {
        Util.postCnzzData("成就卡界面跳转到FM");
        location.href = "https://h5.ichangtou.com/h5/fm/index.html#/mine";
    }
});

module.exports = GetReward;