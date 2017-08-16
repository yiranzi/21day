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
            <div style = {{backgroundColor: '#FFE69B'}}className="home-work-21">
                <FixedBg/>
                <div className="content">
                    <div className="title">{this.renderTitle()}</div>
                    <div style = {this.state.homeWorkStatus === 'doing' ? {opacity: '0.2'} : {}} className = 'answer-area'>
                        {this.renderHomeWorkList()}
                    </div>
                    <div>{this.renderSubmit()}</div>

                </div>
            </div>
            )
    },

    renderSubmit() {
        let txt = '';
        switch(this.state.homeWorkStatus) {
            case 'undo':
                txt = '提交';
                break;
            case 'doing':
                txt = '已提交';
                break;
            case 'done':
                txt = '已提交';
                break;
            default:
                break;
        }
        if(this.state.homeWorkStatus) {
            return(<span className="submit" onClick = {this.GetCommentClick.bind(this,this.state.homeWorkStatus)}>{txt}</span>)
        }
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
            arr.push(<div  className = 'area'>
                <div  className = 'question-area'>
                    <p className="title">{`作业${titles[i]}`}</p>
                    <p className="question">{content.question}</p>
                </div>
                {this.renderTextArea(i)}
            </div>)

            // arr.push(this.renderTextArea(content.answer,i))
        }
        return arr;
    },

    renderTextArea(index) {
        let commentStyle = {
            position: 'relative',
            border: '2px solid #907660',
            width: '100%',
            height: '237px',
            borderRadius: '10px',
            backgroundColor: '#FFF7E0',
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
            width: '102px',
            bottom: '0',
            right: '0'

        };
        if(score) {
            return(<img style = {scoreStyle} src={ `./assetsPlus/image/${GlobalConfig.getCourseName()}/homework_score_${score}.png`}/>)
        }
    },

    //提交按钮
    GetCommentClick(type) {
        console.log('click');
        switch(type) {
            case 'undo':
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
                break;
            case 'doing':
                window.dialogAlertComp.show('已提交,耐心等等哦','您已提交，老师会尽早为您批改的！','知道啦',()=>{},'',false);
                break;
            case 'done':
                window.dialogAlertComp.show('已批改','对成绩还满意吗？点击右上角分享给好友让他们也来一起吧！','知道啦',()=>{},'',false);
                break;
            default:
                break;
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
            window.dialogAlertComp.show('提交成功','您已提交，老师会尽早为您批改的！','知道啦',()=>{},'',false);
            this.setState({homeWorkStatus: doing});
        });

    },

    cbfOnChange(index,comment) {
        this.state.textContents[index] = comment;
        this.setState({textContents: this.state.textContents});
    },


});

module.exports = CourseBegin;