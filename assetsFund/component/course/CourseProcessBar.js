/**
 * Created by yiran on 2017/5/5.
 */
const React = require('react');

const CourseProcessBar = React.createClass({

    getInitialState: function() {
        return {
            // finishElement: this.props.finishElement,
            // totalElement: this.props.totalElement
        };
    },


    render() {
        return(
            <div className="course-process-bar">
                {/*<p>{this.props.finishElement}</p>*/}
                {/*<p>{this.props.totalElement}</p>*/}
                {this.renderTotalElement()}
            </div>
        )
    },

    renderTotalElement() {
        let arr = [];
        for (let i = 0; i < this.state.totalElement; i++) {
            //如果当前渲染的
            if ( i < this.props.finishElement) {
                arr.push(<img className="process-bar" index = {i} style={{backgroundImage: "./assetsFund/image/course/processBar_On.png"}}></img>)
            } else {
                arr.push(<img className="process-bar" index = {i} style={{backgroundImage: "./assetsFund/image/course/processBar_Off.png"}}></img>)
            }
        }
        return arr;
    },


});

module.exports = CourseProcessBar;
