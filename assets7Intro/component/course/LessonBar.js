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
            day: [
                '第一天',
                '第二天',
                '第三天',
                '第四天',
                '第五天',
                '第六天',
                '第七天',
            ],
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
            <div>
                <div className="bar-background"></div>
                {this.LineRender()}
            </div>
        )
    },
    // style={{backgroundImage:'url('+content.image+')'}}
    LineRender() {
        let content = this.state.content;
        //TODO 这里面需要修改
        if(content.status === -1)
        {
            return (<div className="column-container">
                <div className="column-not-view">
                    <h1>
                        {this.state.day[this.state.index]}
                    </h1>
                    <h2>
                        {content.title}
                    </h2>
                </div>

            </div>)
        } else {
            return (<div className="column-container">
                <div className="pic-container">
                    <img className="column-pic" src={content.status === 2 ? this.state.unlockPic[this.state.index]:this.state.lockPic[this.state.index]}/>
                </div>
                <span className="column-container-title">
                <h1>{this.state.day[this.state.index]}</h1>
                {this.renderFinish()}
                <h2>{content.title}</h2>
            </span>
            </div>)
        }

    },

// {/*<span>{this.state.type[content.status + 1]}</span>*/}
// {/*<img className="column-type" src={this.state.typePic[content.status + 1]}/>*/}

    renderFinish() {
        if( this.state.content.status === 2) {
            return <img className="column-type" src={'./assets7Intro/image/course/indFinished.png'}/>
        } else {
            return <div className="space-pic"></div>
        }
    }
});

module.exports = LessonBar;