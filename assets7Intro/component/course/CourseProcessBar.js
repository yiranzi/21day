/**
 * Created by yiran on 2017/5/5.
 */
const React = require('react');

const CourseProcessBar = React.createClass({

    getInitialState: function() {
        return {
            finishElement: [],
            totalElement: []
        };
    },


    render() {
        return(
            <div className="course-process-bar">
                <p>{this.state.finishElement}</p>
                <p>{this.state.totalElement}</p>
                {this.renderTotalElement()}
            </div>
        )
    },

    renderTotalElement() {
        let arr = [];
        for (let i = 0; i < this.state.finishElement.length; i++) {
            //如果当前渲染的
            if ( i < finishElement) {
                arr.push(<div className="process-bar-have" index = {i}>111</div>)
            } else {
                arr.push(<div className="process-bar" index = {i}>222</div>)
            }
        }
        return arr;
    },


});

module.exports = CourseProcessBar;
