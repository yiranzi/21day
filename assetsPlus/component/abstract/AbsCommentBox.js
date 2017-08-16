/**
 * Created by ichangtou on 2017/8/3.
 */
const React = require('react');


// interface StateTypes {
//
//     index: number,//设置index的接口.(设置了就不会改变的,不应该放在state中)
//          content:内容包
//         status: String,//表示按钮的状态.
//         cbfClick: Function,//点击事件回调接口
//         // cbfHover: Function,
//         // cbfPress: Function,
//         //数据
//         title: String,//可选标题
//         imageOn: String//背景图片
//         imageOff: String//背景图片
//     //样式
//     styleBox: Object,//定义操作相应区域样式(大小)的接口
//         styleClick: Object,
//         styleHover: Object,
//         stylePress: Object,
//         styleDefault: Object,

// cbfGetComment //获取文本框中的内容
// index    //评论框Id
// cbfPush
//
//
// }

const AbsCommentBox = React.createClass({
    getInitialState: function() {
        // console.log('123');
        return {
            calcCommentBool: this.props.getCommentBool,
        };
    },

    // componentWillMount() {
    //     console.log('enter mine');
    //     // this.getUserInfo();
    //
    // },

    render (){
        this.calcCommentBool();
        return(<textarea id="comment">
            默认文本
                    </textarea>);
        return(<div style={this.addStyleByStatus()} onClick={this.cbfClick} onMouseOver={this.cbfHover} onMouseOut = {this.cbfHoverOut}>
            {this.renderContent()}
            {/*<div style = {this.props.styleBox}*/}

            {/*{this.props.title}*/}
            {/*{this.props.children}*/}

            {/*</div>*/}
        </div>)

    },

    calcCommentBool() {
        console.log('child');
        if(this.state.calcCommentBool !== this.props.getCommentBool) {
            //发送记录
            console.log('give');
            this.cbfGetComment();
            //记录新的值
            this.setState({calcCommentBool: this.props.getCommentBool})
        }

    },

    cbfGetComment() {
        let comment = document.getElementById("comment").value;
        if(!comment) {
        } else {
            this.props.cbfGetComment(comment);
        }
    },




});

module.exports = AbsCommentBox;







