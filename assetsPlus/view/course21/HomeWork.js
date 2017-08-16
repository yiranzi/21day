/**
 * Created by ichangtou on 2017/7/21.
 */
/**
 * Created by yiran1 on 2017/5/5.
 */
const React = require('react');

//根目录
const Tools = require('../../GlobalFunc/Tools');
const convertHtmlToBase64 = require('../../ImageShare');
const Dimensions = require('../../Dimensions');
const Material = require('../../Material');
var User = require('../../User');
const WxConfig = require('../../WxConfig');
const Util = require('../../Util');

const FixedBg = require('../../component/course/FixedBg');
const Actions = require('../../GlobalStorage/Actions');

const ModalMask = require('../../component/common/ModalMask');
const AbsCommentBox = require('../../component/abstract/AbsCommentBox');

const CourseBegin = React.createClass({
    getInitialState: function() {

        return {
            getCommentBool: false,
        };
    },


    componentWillMount() {
        // let type2Name = {
        //     'select': '关注',
        //     'other': '分享',
        //     'mine': '社群',
        // }
        // MyStorage.whenEnterPage('begin',[type2Name[this.props.params.type]]);
        MyStorage.whenEnterPage('homework');
        console.log('123')
    },

    render() {
        console.log('render');
        console.log(this.props.params.dayId);
        return(
            <div>
                <div onClick = {this.GetCommentClick}>123</div>
                <AbsCommentBox getCommentBool = {this.state.getCommentBool} cbfGetComment = {this.cbfGetComment}></AbsCommentBox>
            </div>
            )
    },

    GetCommentClick() {
        console.log('click');
        this.setState({getCommentBool: !this.state.getCommentBool})
        console.log(this.state.getCommentBool);
    },

    cbfGetComment(index,comment) {
        // let arr = [];
        // arr[index] = comment;
        // for(let i = 0 ; i < arr.length; i++) {
        //
        // }
        console.log(index);
        console.log(comment);
    },


});

module.exports = CourseBegin;