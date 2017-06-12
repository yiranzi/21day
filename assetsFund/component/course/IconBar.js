/**
 * Created by yiran on 2017/5/5.
 */
const React = require('react');

const IconBar = React.createClass({

    getInitialState: function() {
        return {
            // finishElement: this.props.finishElement,
            // totalElement: this.props.totalElement
        };
    },


    render() {
        return(
            <div className="icon-bar">
                {this.renderImg}
                {this.renderTitle}
            </div>
        )
    },

    renderImg() {
        let type = 0;
      if (this.props.isView) {
          type = 0;
      }  else {
          type = 1;
      }
        return(<img className="icon-img" src={this.props.iconImg[type]}/>)
    },

    renderTitle() {
        return(<p className = "title">{this.props.iconTitle}</p>)
    },

    renderTotalElement() {
        let arr = [];
        for (let i = 0; i < this.state.totalElement; i++) {
            //如果当前渲染的
            if ( i < this.props.finishElement) {
                arr.push(<div className="process-bar-have" index = {i}>111</div>)
            } else {
                arr.push(<div className="process-bar" index = {i}>222</div>)
            }
        }
        return arr;
    },


});

module.exports = IconBar;
