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
        return (<div className="column-container" style={{backgroundImage:'url('+content.image+')'}}>
            <span>{content.title}</span>
            <span>{this.state.type[content.status + 1]}</span>
        </div>)
    }
});

module.exports = LessonBar;