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
        for (let i = 0; i < this.props.totalElement; i++) {
            //如果当前渲染的
            if ( i < this.props.finishElement) {
                arr.push(<img className="process-bar" index = {i} src={"./assetsFund/image/course/processBar_On.png"}/>)
            } else {
                arr.push(<img className="process-bar" index = {i} src={"./assetsFund/image/course/processBar_Off.png"}/>)
            }
        }
        return arr;
    },


});

module.exports = CourseProcessBar;
