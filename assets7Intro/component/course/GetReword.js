/**
 * Created by yiran on 2017/5/5.
 */
const $ = window.$ = require('jquery');
const React = require('react');
const Dimensions = require('../../Dimensions');

const GetReward = React.createClass({
    getInitialState: function() {
        console.log('123');
        return {
            content: this.props.content,
            lockPic: [
                "./assets/image/course/card_1.png",
                "./assets/image/course/card_2.png",
                "./assets/image/course/card_3.png",
                "./assets/image/course/card_4.png",
                "./assets/image/course/card_5.png",
                "./assets/image/course/card_6.png",
                "./assets/image/course/card_7.png",
            ],
        };
    },

    componentWillMount() {
        let lessonId = this.props.params.lessonId;
        console.log(lessonId)
    },


    handleClick() {
        location.hash = "/select";
    },
    // style = {fullbg}
    render() {
        return(
            <div className="bg-ground" style = {{backgroundImage: 'url("./assets7Intro/image/course/bg_1.png")',width: Dimensions.getWindowHeight(), height: Dimensions.getWindowHeight()}}  onClick={this.handleClick}>
                <img className="reward-pic" src={this.state.lockPic[this.props.params.lessonId]}/>
            </div>
        )
    }
});

module.exports = GetReward;