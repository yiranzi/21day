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
                "./assets/image/course/card_1.png"
            ],
            unlockPic: [
                "./assets/image/course/card_2.png"
            ],
            typePic: [
                "./assets/image/course/indWrong.png",
                "./assets/image/course/indRight.png",
                "./assets/image/course/indRight.png",
                "./assets/image/course/indRight.png",
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
            <img className="column-pic" src={content.status === 2 ? this.state.unlockPic[0]:this.state.lockPic[0]}/>
            <span className="column-container-title">{content.title}</span>
            <span>{this.state.type[content.status + 1]}</span>
            <img className="column-type" src={this.state.typePic[content.status + 1]}/>
        </div>)
    }
});

module.exports = LessonBar;