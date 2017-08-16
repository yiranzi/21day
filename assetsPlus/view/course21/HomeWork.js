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
            // getCommentBool: false,
            commentDisabled: false,
            homeWorkList: {},
            homeWorkStatus: '',
            textContents: [],
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
        //1获取作业信息
        this.getHomeWorkList();
    },

    getHomeWorkList() {
        let arr = [];
        let dayId = this.props.params.dayId;
        Material.getHomeworkByDay(dayId).then((value)=>{
            this.setState({
                homeWorkList: value.questions,
            });
            //设定编辑状态
            if(value.status === 'unfinished') {
                this.state.commentDisabled = true;
            } else {
                this.state.commentDisabled = false;
            }
            switch(value.status) {
                case 'unfinished':
                    this.state.homeWorkStatus = 'undo';
                    break;
                case 'correcting':
                    this.state.homeWorkStatus = 'done';
                    break;
                case 'nocorrections':
                    this.state.homeWorkStatus = 'doing';
                    break;
                default:
                    break;
            }
            //设定文本
            for(let i = 0 ; i < value.questions.length; i++) {
                if(value.questions[i].answer) {
                    this.state.textContents[i] = value.questions[i].answer;
                } else {
                    this.state.textContents[i] = '输入作业';
                }
            }
            this.setState({
                commentDisabled: this.state.commentDisabled,
                textContents: this.state.textContents,
                homeWorkStatus: this.state.homeWorkStatus,
            });

        })
    },

    render() {
        return(
            <div className="home-work-21">
                <FixedBg/>
                <div className="content">
                    <div className="title">{this.renderTitle()}</div>
                    <div className = 'answer-area'>
                        {this.renderHomeWorkList()}
                    </div>
                    <div onClick = {this.GetCommentClick}>提交</div>
                </div>
            </div>

            )
    },

    renderTitle() {
        let homeWorkStatus = this.state.homeWorkStatus;
        let arr = [];
        arr.push(<p>作业正在批改</p>);
        arr.push(<p>..........</p>);
        if (homeWorkStatus === 'doing') {
            return arr;
        };
    },

    renderHomeWorkList() {
        let contents = this.state.homeWorkList;
        let content = {};
        let titles = ['一','二','三','四'];
        let arr = [];
        for(let i = 0 ;i < contents.length; i++) {
            console.log(i);
            content = contents[i];
            arr.push(<p className="title">{`作业${titles[i]}`}</p>);
            arr.push(<p className="question">{content.question}</p>);
            // arr.push(this.renderTextArea(content.answer,i))
            arr.push(this.renderTextArea(i))
        }
        return arr;
    },

    renderTextArea(index) {
        let commentStyle = {
            position: 'relative',
            border: '1px solid red',
            width: '353px',
            height: '237px',
            borderRadius: '15px',
            backgroundColor: 'yellow',
            padding: '5px',
        };
        return (<div style = {commentStyle}>
            <AbsCommentBox index = {index} currentContent = {this.state.textContents[index]} status = {this.state.commentDisabled} cbfOnChange = {this.cbfOnChange}></AbsCommentBox>
            {this.renderScore(index)}
        </div>)
    },

    renderScore(index) {
        let contents = this.state.homeWorkList;
        let score = contents[index].score;
        let scoreStyle = {
            position: 'absolute',
            width: '35.3px',
            height: '23.7px',
            bottom: '0',
            right: '0'

        };
        if(score) {
            return(<img style = {scoreStyle} src={ `./assetsPlus/image/${GlobalConfig.getCourseName()}/homework_score_${score}.png`}/>)
        }
    },

    //提交按钮
    GetCommentClick() {
        console.log('click');
        let current = 0;
        //判定全部填入信息
        for(current ;current < this.state.textContents.length; current++) {
            if(this.state.textContents[current] === null) {
                break;
            }
        }
        if(current === this.state.textContents.length) {
            this.postAnswer();
            //提交
        } else {
            console.log('empty');
            //没填满
        }
    },

    postAnswer() {
        let itemIdArray = [];
        let answerArray = [];
        //index 得到答案 得到题目ID
        for(let i = 0; i < this.state.homeWorkList.length; i++) {
            let itemId = this.state.homeWorkList[i].questionId;
            let answer = this.state.textContents[i];
            itemIdArray.push(itemId);
            answerArray.push(answer);
        }
        Material.postHomeworkAnswerById(itemIdArray,answerArray).then((data)=>{
            console.log(data)
        });

    },

    cbfOnChange(index,comment) {
        this.state.textContents[index] = comment;
        this.setState({textContents: this.state.textContents});
    },


});

module.exports = CourseBegin;