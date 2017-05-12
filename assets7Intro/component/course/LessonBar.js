/**
 * Created by yiran on 2017/5/5.
 */
const $ = window.$ = require('jquery');
const React = require('react');

const LessonBar = React.createClass({

    getInitialState: function() {
        return {
            content: this.props.content,
            index: this.props.index,
            type: [
                '未解锁!',
                '新的!未听!',
                '没听完',
                '已完成'
            ],
            lockPic: [
                "./assets7Intro/image/course/card_1.png",
                "./assets7Intro/image/course/card_2.png",
                "./assets7Intro/image/course/card_3.png",
                "./assets7Intro/image/course/card_4.png",
                "./assets7Intro/image/course/card_5.png",
                "./assets7Intro/image/course/card_6.png",
                "./assets7Intro/image/course/card_7.png",
            ],
            unlockPic: [
                "./assets7Intro/image/course/card_1.png",
                "./assets7Intro/image/course/card_2.png",
                "./assets7Intro/image/course/card_3.png",
                "./assets7Intro/image/course/card_4.png",
                "./assets7Intro/image/course/card_5.png",
                "./assets7Intro/image/course/card_6.png",
                "./assets7Intro/image/course/card_7.png",
            ],
            typePic: [
                "./assets7Intro/image/course/indWrong.png",
                "./assets7Intro/image/course/indRight.png",
                "./assets7Intro/image/course/indRight.png",
                "./assets7Intro/image/course/indRight.png",
            ],
        };
    },

    render() {
        return(
            <div  className="lesson-bar">
                {this.LineRender()}
            </div>
        )
    },
    // style={{backgroundImage:'url('+content.image+')'}}
    LineRender() {
        let content = this.state.content;
        return (<div className="column-container">
            <img className="column-pic" src={content.status === 2 ? this.state.unlockPic[this.state.index]:this.state.lockPic[this.state.index]}/>
            <span className="column-container-title">{content.title}</span>
            <span>{this.state.type[content.status + 1]}</span>
            <img className="column-type" src={this.state.typePic[content.status + 1]}/>
        </div>)
    }
});

module.exports = LessonBar;