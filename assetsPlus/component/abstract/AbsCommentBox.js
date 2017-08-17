/**
 * Created by ichangtou on 2017/8/3.
 */
const React = require('react');


// interface StateTypes {
// cbfOnChange //更新文本框
// index    //评论框Id
//disabled  //是否可用
//currentContent //显示内容
//defaultTxt //默认内容
// }

const AbsCommentBox = React.createClass({
    getInitialState: function() {
        return {
            // calcCommentBool: this.props.getCommentBool,
            // textAreaContent: this.props.currentContent,
        };
    },

    // componentWillMount() {
    //     console.log('enter mine');
    //     // this.getUserInfo();
    //
    // },

    render (){
        let defaultStyle = {
            width: '100%',
            height:'100%',
            border: '0',
            backgroundColor: 'inherit',
        };
        // this.calcCommentBool();
        return(<textarea onChange = {this.handleChange} style={defaultStyle} value = {this.props.currentContent}>
                    </textarea>);
    },

    handleChange() {
        //如果可以编辑
        if(this.props.status) {
            this.props.cbfOnChange(this.props.index,event.target.value);
        }
    },

    // calcCommentBool() {
    //     console.log('child');
    //     if(this.state.calcCommentBool !== this.props.getCommentBool) {
    //         //发送记录
    //         console.log('give');
    //         this.cbfGetComment();
    //         //记录新的值
    //         this.setState({calcCommentBool: this.props.getCommentBool})
    //     }
    //
    // },
    //
    // cbfGetComment() {
    //     let comment = this.state.textAreaContent;
    //     console.log('getgetget');
    //     if(!comment) {
    //     } else {
    //         this.props.cbfGetComment(this.props.index,comment);
    //     }
    // },




});

module.exports = AbsCommentBox;







