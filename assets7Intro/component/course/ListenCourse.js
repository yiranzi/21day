/**
 * Created by Administrator on 17-2-23.
 */
const $ = window.$ = require('jquery');
const React = require('react');
const ReactDom = require('react-dom');
// const Player = require('./Player');
const Link = require('react-router').Link;
const Material = require('../../Material');
// const TitleBar = require('./TitleBar');
const Loading = require('../../Loading');
const GlobalAudio = require('../GlobalAudio');
const AudioProgressBar = require('../Audio/AudioProgressBar');
const OnFire = require('onfire.js');
const WxConfig = require('../../WxConfig');
const Modal = require('./../Modal');
const Toast = require('./../Toast');
const Util = require('../../Util');
const CheckinPanel = require('../CheckinPanel');
const DidCheckinPanel = require('../DidCheckinPanel');
const EnterPanel = require('../EnterPanel');

const ChooseBar = require('./Choose');
const AudioBar = require('./Audio');



const User = require('../../User');

const ListenCourse = React.createClass({

    getPropsType() {
        return {
            fmid: React.PropTypes.string
        }
    },


    getInitialState() {
        return {
            // columnid: this.props.params.columnid,
            // fmid: this.props.fmid || this.props.params.fmid,
            audioSource: '',
            commentCount: 0,
            cover: '',
            fmList: [],
            fmTitle: '',
            userImages: [],
            showOthers: false, //显示其他小节
            previousIssue: false, //上一期
            nextIssue: false, //下一期
            isPlaying: false,
            showComment: false,
            todayGoldCoin: 0,
            showCheckInPanel: false,//显示打卡panel
            showDidCheckInPanel:false,//显示打卡后panel
            hasCheckIn: false,
            isPlay: true,
            showEnterPanel:false,
            showEnterPaneltest:false,
            currentPlaying: -1,
            defaultAnswer: true,
            // userChoose: [
            //     [-1],[-1],[-1],[-1]
            // ],
            myTest: 'PhP is Best',
            audiosTest: [],
            questions: [
                [
                    {
                        content: ['增长最帅','PHP is Best','no bug no game'],
                        title: '1哪个是正确的?',
                        answer: 0,
                        process: false,
                    },
                ],
                [
                    {
                        content: ['地球是方的','长投是好的','天是圆的'],
                        title: '2哪个是正确的?',
                        answer: 1,
                        process: false,
                    },
                ],

            ],
            audios: [
                {
                    audioSource: '连接1',
                    title: '第一节',
                    process: false,
                },
                {
                    audioSource: '连接2',
                    title: '第二节',
                    process: false,
                },
            ]
        }
    },


    componentWillMount() {
        console.log('FMView');

        if (User.getUserInfo().userId) {

            this.getFmInfo();

        } else {
            OnFire.on('OAUTH_SUCCESS', (userInfo)=>{
                this.getFmInfo();
            })
        }

        OnFire.on('AUDIO_END',()=>{
            console.log('Fire AUDIO_END end!!!!!')
            // 听完后自动播放下一节
            if (this.state.nextIssue) {
                // this.clickNextHandler();
            } else {
                this.setState({
                    isPlaying: false
                })
            }
            this.state.audios[this.state.currentPlaying].process = true;
            let localAudios = this.state.audios;
            this.setState({audios: localAudios});
        });

        // Util.postCnzzData('点击小节',this.state.fmid);
    },
    /**
     * 获取已购买专辑，判断是否购买
     */
    getFmColumn() {

        Loading.showLoading('获取信息...');
        console.log('接收到的是' + this.props.params.courseId);
        let fmall = 2017;
        Material.getJudgeFromServer(fmall).always((albumId)=>{
            Loading.hideLoading();
            console.log('albumId8888888888',albumId);
            if(albumId){
                console.log('购买过');
                if (!Util.isIphone()) {
                    GlobalAudio.play(this.state.audioSource,this.state.fmId);
                    this.setState({
                        isPlaying: true,
                        isPlay: true,
                    });
                }

            } else{

                this.setState({
                    isPlaying: false,
                    isPlay: false,
                    showEnterPanel:true,
                });

            }
        })
    },
    /**
     * 获取信息
     */
    getFmInfo() {
        console.log('change2')
        Loading.showLoading('获取信息...');

        let fmid = this.props.params.courseId;
        this.state.fmId = this.props.params.courseId;
        Material.getFmInfoFromServer(fmid).always((fmInfo) => {
            Loading.hideLoading();
            console.log('fmInfo', fmInfo);
            if (fmInfo) {
                this.setState({
                    audioSource: fmInfo.audioSource,
                    commentCount: fmInfo.commentCount,
                    cover: fmInfo.cover,
                    fmList: fmInfo.fmList,
                    fmTitle: fmInfo.fmTitle,
                    userImages: fmInfo.userImages,
                    fmId: fmInfo.fmId,
                });
                let fmid = this.state.fmId;
                this.setShareConfig(fmid, fmInfo.fmTitle);
                this.getFmColumn();
            }
        });
        let arr = [];
        Material.getFmInfoFromServer(20171).always((fmInfo) => {
            Loading.hideLoading();
            console.log('fmInfo', fmInfo);
            if (fmInfo) {
                arr.push(fmInfo.audioSource)
            }
        });
        Material.getFmInfoFromServer(20172).always((fmInfo) => {
            Loading.hideLoading();
            console.log('fmInfo', fmInfo);
            if (fmInfo) {
                arr.push(fmInfo.audioSource)
            }
        });
        this.setState({
            audiosTest: arr,
        });
    },



    /**
     * 购买后点击评论
     */
    clickCommentHandler() {
        console.log('clickCommentHandler');

        this.setState({
            showComment: true
        });

        Util.postCnzzData('点击评论');
    },
    /***
     * 未购买时点击评论
     */
    not_clickCommentHandler(){
        Util.postCnzzData('未购买点击评论键');
        console.log('未买课，点评论');
        this.setState({
            showEnterPanel: true,
        });
    },


    modalClickHandler() {
        this.setState({
            showEnterPanel: false,
        })
    },
    /***
     * 未购买时点击播放键
     */
    not_controlHandler(){
        Util.postCnzzData('未购买点击播放键');
        console.log('未购买过11111111111');
        this.setState({
            showEnterPanel: true,

        });

        console.log('showEnterPaneltest',this.state.showEnterPanel);
    },


    /**
     * 设置分享内容
     * @param fmid
     * @param title
     */
    setShareConfig(fmid,title) {
        let shareTitle = '小白理财FM《'+title+'》',
            link = location.origin+location.pathname+
                "?fmid="+fmid;

        WxConfig.shareConfig(shareTitle,'',fmid,link);
    },

    /**
     * 设置hash
     * @param fmid
     */
    setNewHash(fmid) {
        let newHash = "#/columnlist/"+this.state.columnid+"/"+fmid;
        history.replaceState(location.href, "", location.origin+location.pathname+newHash);

    },

    /**
     * 设置选中的答案
     * @param fmid
     */
    OnChoosePass(index) {
        console.log('pass');
        this.state.questions[this.state.currentPlaying][index].process = true;
        let localQuestions = this.state.questions;
        this.setState({questions: localQuestions});
    },

    /**
     * 点击按钮的回调
     * @returns {*}
     */
    OnAudioButton(index, isPlaying) {
        console.log('fatther click', index, isPlaying);
        if (isPlaying) {
            this.setState({currentPlaying: -1});
        } else {
            this.setState({currentPlaying: index});
        }
        this.controlHandler(index, isPlaying)
    },

    /**
     * 多个组件,同一个回调函数控制播放键操作
     */
    controlHandler(index, isPlaying) {
        if (isPlaying) {
            GlobalAudio.pause();
        } else {
            GlobalAudio.play(this.state.audiosTest[index]);
        }
    },


    /**
     *
     * @returns {XML}
     */
    render() {
        let preStyle = {},nextStyle = {};
        preStyle.visibility = this.state.previousIssue ?  'visible' : 'hidden';
        nextStyle.visibility = this.state.nextIssue ?  'visible' : 'hidden';

        return(
            <div className="fm-view">
                {this.state.showEnterPanel && <div onClick={this.modalClickHandler}>
                    <Modal  hideOnTap={false}>

                        <EnterPanel/>

                    </Modal></div>
                }
                <span>welcom</span>
                <h2 className="fm-title">{this.state.fmTitle}</h2>
                <h1 className="fm-title">{this.state.myTest}</h1>
                <span>11{this.state.isPlay}</span>
                <span>{this.state.isPlay ? "/"+this.state.fmId+"/comment" : ''}</span>
                <img src={this.state.cover} className="fm-cover"/>
                <AudioProgressBar/>
                <div className="control-button-container">
                </div>
                <div>{this.props.location.query.name}</div>
                {this.renderLesson()}
                {this.passLessonRender()}
            </div>
        )
    },

    passLessonRender() {
        let question = this.state.questions[this.state.questions.length - 1];
        if(question[question.length - 1].process === true) {
            let index = this.props.params.courseId - 20171;
            console.log('fire!',index);
            OnFire.fire('Pass_Lesson',index);
            return (<div>祝贺 完成本节 这是你的道具卡 快快可以你的战利品吧!!</div>);
        }
    },


    /**
     * 渲染听课列表
     * @returns {*}
     */
    renderLesson() {
        console.log('startrender111');
        let audios = this.state.audios;
        let questions = this.state.questions;
        let arr = [];
        let count = 0;

        let allPass = false;
        if (this.props.location.query.name === 3) {
            allPass = true;
        }
        //循环所有的FM
        OUT:
        for (let i = 0;i < audios.length; i++) {
            //如果满足...渲染FM.无条件渲染fm
            if(allPass || i === 0 || questions[i-1][(questions[i-1].length) - 1].process) {
                arr.push(this.renderFMBar(i, audios[i]))
                //如果fm听完
                if(allPass || audios[i].process){
                    let lessonQuestions = questions[i];
                    //循环某一节的所有的题目
                    for (let j = 0; j < lessonQuestions.length; j++){
                        //如果上一道题答对
                        if( allPass || j === 0 || lessonQuestions[j-1].process) {
                            //如果满足...渲染题目
                            arr.push(this.renderChooseBar(lessonQuestions[j], j))
                        } else break OUT;
                    }
                } else break OUT;
            }
        }
        return arr;
    },

    /**
     * 渲染播放音频列表
     * @returns {*}
     */
    renderFMBar(index, FMContent) {
        // let FMList = this.state.audios;
        // let arr = [];
        // let count = 0;
        // if( !FMList ) {
        //     return null;
        // } else {
        //     for(let item of FMList) {
        //         // arr.push(<span key={count}>{item.audioSource}</span>)
        //         arr.push(<ChooseBar question={this.state.questions[this.state.playingIndex][0]} passCallBack = {this.OnChoosePass}/>)
        //         count++;
        //     }
        //     return arr;
        // }
        return <AudioBar
            content = {FMContent}
            playingIndex = {this.state.currentPlaying}
            audioIndex={index}
            audioCallBack = {this.OnAudioButton}/>
    },

    renderChooseBar(questions, questionIndex) {
        if( !questions ) {
            return null;
        } else {
            return <ChooseBar index = {questionIndex} question={questions} passCallBack = {this.OnChoosePass}/>

        }
    },

    renderCourseList() {
        // let FMList = this.state.audios;
        // for(let item of FMList) {
        //     item.audioSource
        // }
    },


    /**
     * 渲染用户头像
     * @returns {*}
     */
    renderUserImages() {

        console.log('后');
        let imgList = this.state.userImages;

        if( !imgList || imgList.length == 0){
            return null;
        }else{

            let arr = [];

            for(let i of imgList){
                arr.push(<img src={i} className="user-headimage"/>)
            }

            return arr;
        }
    },


    /**
     * 渲染fm小节
     * @returns {*}
     */
    renderFmList() {
        let fmList = this.state.fmList;

        if( fmList.length == 0){
            return null;
        }else{

            let arr = [];

            for(let i of fmList){
                arr.push(<div className="section-item"
                              onClick={this.changeSectionHandler.bind(this,i)}>
                    <p className="section-title">{i.fmTitle}</p>
                    <p className="section-duration">{i.createTime}</p>
                </div>)
            }

            return arr;
        }

    }
});

module.exports = ListenCourse;