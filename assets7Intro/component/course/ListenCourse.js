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
            myTest: 'PhP is Best',
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
            // 听完后自动播放下一节
            if (this.state.nextIssue) {
                // this.clickNextHandler();
            } else {
                this.setState({
                    isPlaying: false
                })
            }
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
        this.state.fmId =  this.props.params.courseId;
        console.log('fmid获取',fmid);

        // let fm = 20171;

        Material.getFmInfoFromServer(fmid).always((fmInfo)=>{
            Loading.hideLoading();

            // console.log('fmid',fmid);
            console.log('fmInfo',fmInfo);
            if(fmInfo){
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
                this.setShareConfig(fmid,fmInfo.fmTitle);
                this.getFmColumn();


            }

            console.log('fmid',this.state.fmId);
        })
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
    /**
     * 控制播放键操作
     */

    controlHandler() {
        if (this.state.isPlaying) {
            GlobalAudio.pause();
            this.setState({
                isPlaying: false
            });
            console.log('isPlaying: false');
        } else {
            GlobalAudio.play(this.state.audioSource, this.state.fmId);
            console.log(this.state.fmId);
            this.setState({
                isPlaying: true
            });
            console.log('isPlaying: true');
        }


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
                {/*{this.state.showEnterPaneltest && <div onClick={this.modalClickHandlertest}>*/}
                {/*<Modal  hideOnTap={false}>*/}

                {/*<EnterPanel/>*/}

                {/*</Modal></div>*/}
                {/*}*/}
                <span>welcom</span>
                <h2 className="fm-title">{this.state.fmTitle}</h2>
                <h1 className="fm-title">{this.state.myTest}</h1>
                <span>11{this.state.isPlay}</span>
                <span>{this.state.isPlay ? "/"+this.state.fmId+"/comment" : ''}</span>
                <img src={this.state.cover} className="fm-cover"/>

                <AudioProgressBar/>

                <div className="control-button-container">

                    <img src={this.state.isPlaying ? './assets/image/player/play.png':'./assets/image/player/pause.png'}
                         className="play-pause-button"
                         onClick={this.state.isPlay ? this.controlHandler : this.not_controlHandler}
                    />

                </div>
            </div>
        )
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