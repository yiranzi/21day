/**
 * Created by Administrator on 16-8-2.
 */
var React = require('react');
var ReactDom = require('react-dom');
var $ = require('jquery');
var OnFire =require('onfire.js');
var GHGuider = require('./GHGuider');

var User = require('../User');
var Dimensions = require('../Dimensions');
var PayController = require('../PayController');
var Util = require('../Util');
var Material = require('../Material');
var Loading = require('../Loading');
var DialogAlert = require('./DialogAlert');
var DoneToast = require('./DoneToast');
var SeniorInfo = require('./SeniorInfo');
const SharePanel = require('./SharePanel');
const Timeout = require('./Timeout');
const Modal = require('./Modal');
const FirstSharePanel = require('./FirstSharePanel');

var REMAIN_NUM = 852;

var PayPage = React.createClass({

    getInitialState(){
        return {
            hasPaid:false, //是否付费
            isSubscribed: true, //是否订阅
            showGuide: false, // 显示关注引导信息
            showShareHint: false, //显示分享
            QQNum: null, //QQ群号
            QQLink: null, //QQ群链接
            QQCode: null, //QQ暗号
            showBackup: false, //显示备用QQ
            hasRecord: true, //获得报名记录
            remain: parseInt(localStorage.getItem('remain-num'))||REMAIN_NUM, //剩余席位

            //21days2.0
            hasSenior: false, //是否有上线
            buttonPrice: 3.8, //
            buttonChange:false,//判断提示时间截止panel
            //share
            showSharePanel: false, //显示分享panel
            showShareModal: false , //显示分享modal

            //wechat
            showWechatGroup: false, //显示微信联系方式
            firstSharePanel:false //首次分享提示
        };
    },


    componentWillMount(){
        // this.timeout();
        this.signUpNumber();

        //分享成功后，通知后台，给用户加红包
        // OnFire.on('SHARE_SUCCESS',this.onShareSuccess);
        OnFire.on('PAID_LOSER',()=>{

                this.setState({
                    showBackup:true,
                })
        });
        //已付费
        OnFire.on('PAID_SUCCESS',(payWay)=>{
            if(!this.state.QQNum){
                //查询报名
                this.postRegisterRecord(User.getUserInfo(),payWay)
            }else{
                this.setState({
                    hasPaid: true,
                    buttonPrice: 0
                })
            }

            this.scrollToTop();

            //绑定上线信息(userId)
            //let seniorId = Util.getUrlPara('ictchannel');
            //seniorId && this.bindSenior(seniorId);

            //统计班主任信息
            // let teacherId = Util.getUrlPara('teacherid');
            // teacherId && Util.postCnzzData('班主任'+teacherId);

            //购买成功后的dialog
            DoneToast.show('报名成功');

            //todo
            // window.dialogAlertComp.show('报名成功','点击“立即加群”进入QQ群。也可以复制页面上的QQ群号，手动进群。请注意页面上的加群【暗号】哟~','知道啦',()=>{},()=>{},false);
        });

        let seniorId = Util.getUrlPara('ictchannel'),
            openId = User.getUserInfo().openId;


        // this.sendSeniorInfo();

        if(openId){
            //获取用户是否有报名记录
            //(同时绑定上下线关系，因为要在加入21天表后，才可以有后续行为)
            this.postRegisterRecord(Util.getCurrentBatch(),User.getUserInfo());

            //设置订阅
            this.setSubscribeInfo(User.getUserInfo().subscribe);

            //设置上线
            // this.setSenior(seniorId,User.getUserInfo().userId);

        }
        else{
            OnFire.on('OAUTH_SUCCESS',(userInfo)=>{
                //获取用户是否有报名记录
                this.postRegisterRecord(userInfo);

                //设置订阅
                this.setSubscribeInfo(userInfo.subscribe);

                //设置上线
                // this.setSenior(seniorId,userInfo.userId);
            });
        }

        this.forSeniors();
    },

    /***
     * 请求剩余报名人数和报名时间是否截止
     */
    signUpNumber(){

        let fmall = 2017;
        Material.getRegistered(fmall).always((int) => {

            console.log('albumId', int);
            this.setState({
                int: (300 - int.number),
                time:int.time,
            });
            console.log('int', this.state.int);
            console.log('time', this.state.time);
        })
    },
    /**
     * 分享成功时的操作
     */
    onShareSuccess() {
        // let userInfo = User.getUserInfo();

        // if(userInfo.userId){
        //     //得红包
        //     Material.getFirstShare(userInfo.userId).always((result)=>{
        //         console.log('result',result);
        //         if(result == true){
        //             //提示红包在哪里
        //             Material.alertRedPacketLocation(this.firstSharePanels);
        //         }
        //     });
        //
        // }else{
            console.log('分享成功');
        // }
    },
    //
    // firstSharePanels(){
    //     this.setState({
    //         firstSharePanel :true
    //     })
    // },



    // sendSeniorInfo() {
    //     const User = require('../User');
    //     let seniorId = Util.getUrlPara('ictchannel');
    //     let userInfo = User.getUserInfo(),
    //         userId = userInfo.userId;
    //     console.log('userInfo',userInfo);
    //     console.log('sid',seniorId);
    //     console.log("userid",userId);
    //     Material.postRecordSenior(seniorId,userId);
    // },




    forSeniors() {

        if(!Util.getUrlPara('ictchannel')){
            //上线用户，显示分享panel
            this.setState({
                showSharePanel: true
            });
        }
    },

    /**
     * 设置用户的上线
     */
    setSenior(seniorId,userId) {
        //seniorId则表示该用户拥有上线
        if(seniorId && seniorId!=userId){
            console.log('userid',userId);
            this.sendSeniorInfo();

            this.setState({
                hasSenior: true,
                // buttonPrice: 6
            });
        }
    },

    /**
     * 发送是否报名请求
     * @param termId
     * @param userInfo
     * @param payWay
     */
    postRegisterRecord (userInfo,payWay) {
        Loading.showLoading('获取信息...');

        console.log('userInfo',userInfo);

        let fmall = 2017;

        Material.getRegisterRecord(userInfo.userId,fmall).done((record)=>{

            Loading.hideLoading();
            console.log('record',record);

            if(record){

                ////todo 123343135
                //
                //if(record.qqGroup ==123343135){
                //    //大群人到微信号
                //    this.setState({
                //        buttonPrice: 0,
                //        hasRecord: true,
                //        hasPaid: true, //已报名
                //        showWechatGroup: true
                //    });
                //}
                //else{
                    this.setState({
                        hasRecord: true,
                        hasPaid: true, //已报名
                        QQNum: record.qqGroup, //QQ群号
                        QQLink: record.qqGroupUrl, //QQ群链接
                        QQCode: record.secret, //QQ暗号
                        buttonPrice: 0
                    });
                //}


            }else{
                this.setState({
                    hasRecord: false,
                    hasPaid: false, //未报名
                    buttonPrice:3.8,
                });
            }

        })
        .fail(()=>{
            Loading.hideLoading();
            if(payWay=='normalPay') {
                //获取报名记录失败，但是有正常支付记录的，进入2000人大群
                //设置备选QQ群
                this.setBackUpQQState();
            }else{
                //获取报名记录失败的（包含没报名的和扫码支付过的）
                this.setState({
                    hasRecord: false //未获得报名记录
                })
            }
        })
    },


    /**
     * 2000人大群 付费群
     * 设置备用QQ群号
     */
    setBackUpQQState() {

        ////todo备用群人到微信号
        //this.setState({
        //    buttonPrice: 0,
        //    hasRecord: true,
        //    hasPaid: true, //已报名
        //    showWechatGroup: true
        //});


        this.setState({
            buttonPrice: 0,
            hasRecord: true,
            hasPaid: true, //已报名
            QQNum: '123343135', //QQ群号
            QQLink: 'http://jq.qq.com/?_wv=1027&k=4193kAr', //QQ群链接
            QQCode: '理财' //QQ暗号
        })
    },

    /**
     * 绑定上下线关系
     * @param seniorId
     */
   /* bindSenior(seniorId) {

        let userInfo = User.getUserInfo();

        if(seniorId == userInfo.userId){
            return;
        }

        User.bindPyramidRelation(userInfo.openId,seniorId);
    },*/

    /**
     * 设置用户关注信息
     * @param subscribe
     */
    setSubscribeInfo(subscribe){
        this.setState({
            isSubscribed: subscribe
        })
    },

    /**
     * 按钮点击
     */
    clickHandler() {
        switch(this.state.buttonPrice){
            // case 3.8:
            case 3.8: this.payHandler();
                break;
            case 0: {
                //if(this.state.showWechatGroup){
                //    dialogAlertComp.show('提示','赶紧扫描加入吧','知道啦',()=>{},'',false);
                //}else{
                    this.entryQQClickHandler();
                //}
            }

                break;
            default:
                console.log('出错');
                break;
        }  
    },
    

    /**
     * 支付动作
     */
    payHandler() {
        Util.postCnzzData('点击报名');

        if(User.getUserInfo().userId){
            this.setState({
                showBackup: false,
            });

            //微信支付
            PayController.wechatPay();
        }else{
            this.setState({
                showBackup: true,
                buttonPrice: 0,
                FMLink:'http://jq.qq.com/?_wv=1027&k=41976jN' //非付费的QQ群号
            });

            this.scrollToTop();
            Util.postCnzzData('拿不到用户数据');
            //提醒用户加付费群
            window.dialogAlertComp.show('提示','你好像被流星砸中...服务器君拿不到你的数据，请点击页面上的QQ群报名训练营','知道啦',()=>{},()=>{},false);
        }

    },

    scrollToTop() {
        scrollTo(0,0);
    },




    /**
     * 点击进入QQ群
     */
    // entryQQClickHandler(){
    //     Util.postCnzzData('点击进入QQ群');
    //
    //     //QQ
    //     location.href = this.state.FMLink;
    //
    // },

    /**
     * 邀请好友
     */
    entryPosterHandler() {
        // Util.postCnzzData('邀请好友');

        //置顶
        scrollTo(0, 0);

        this.setState({
            showShareHint: true
        });
    },

    /**
     * 隐藏提示时间截止panel
     */
    closeSharePanelHandler() {
        this.setState({
            buttonChange: false
        });
    },
    /***
     * 显示提示时间截止panel
     */
    didClickHandler(){

        this.setState({
            buttonChange:true,
        })
    },
    /**
     * 显示shareModal操作
     */
    // shareModalHandler() {
    //     var speed=10;//滑动的速度
    //     $('body,html').animate({ scrollTop: 0 }, speed);
    //     this.setState({
    //         showShareModal: true
    //     })
    // },

    /**
     * 隐藏分享modal
     */
    // hideShareModalHandler() {
    //     this.setState({
    //         showShareModal: false
    //     })
    // },
    //  timeout(){
    //
    //     let date = new Date();
    //     console.log('date',date);
    //     let years = 2017;
    //     let month = 4;
    //     let strDate = 20;
    //     let hours = 15;
    //     let minutes = 55;
    //     let seconds = 0;
    //     let strDates = strDate;
    //     let minutess = minutes+1;
    //     this.setState({
    //         month,
    //         strDates,
    //         years,
    //         hours,
    //         minutess,
    //         seconds,
    //     });
    //     let seperator1 = "-";
    //     let seperator2 = ":";
    //     let months = date.getMonth() + 1;
    //     console.log('month',month);
    //
    //     if(months > 12){
    //         years = years+1;
    //         month = 1;
    //     }else if(months == 1||3||5||7||8||10||12){
    //         if(strDates > 31){
    //            strDates = 1;
    //            month = month+1;
    //         }
    //     }else if (months == 4||6||9||11){
    //         if(strDates > 30){
    //             strDates = 1;
    //             month = month+1;
    //         }
    //     }else {
    //         if (strDates > 29){
    //             strDates = 1;
    //             month = month+1;
    //         }
    //     }
    //     let currentdate = years + seperator1 + month + seperator1 + strDates
    //         + " " + hours + seperator2 + minutess
    //         + seperator2 + seconds;
    //     let newcurrent = date.getFullYear() + seperator1 + months + seperator1 + date.getDate()
    //         + " " + date.getHours() + seperator2 + date.getMinutes()
    //         + seperator2 + date.getSeconds();
    //     console.log('newcurrent',newcurrent);
    //     console.log('currentdate',currentdate);
    //     if (currentdate == newcurrent){
    //         years = date.getFullYear();
    //         month = date.getMonth() + 1;
    //         strDate = date.getDate();
    //         hours = date.getHours();
    //         minutes = date.getMinutes();
    //         seconds = date.getSeconds();
    //         strDates = strDate;
    //         minutess = minutes+1;
    //     }
    //     if (month >= 1 && month <= 9) {
    //         month = "0" + month;
    //     }
    //     if (strDate >= 0 && strDate <= 9) {
    //         strDate = "0" + strDate;
    //     }
    //     return currentdate;
    // },

    render(){
        return (
            <div className="pay_page">
                {/*。。。。。从上线发的链接打开时展示*/}
                {/*{this.state.hasSenior && <SeniorInfo/>}*/}

                {/*点击报名但没有查到用户信息时提示加群*/}
                {this.state.showBackup && <a className="backup-text" href="http://jq.qq.com/?_wv=1027&k=41976jN">QQ群号：
                    <span className="red-text">429827363</span>
                    <p className="red-text  tada animated infinite">暗号：7天</p></a>}
                {/*首次进入时展示的长图*/}
                {!this.state.hasPaid &&
                <div>
                    <div className="top-time-bottom">
                        <div className="top-time">
                            <Timeout finalDate={[2017,4,24,24,0,0]}/>
                        </div>

                    <div className="entered">
                        <div className="show-entered">
                            <img src="./assets21Intro/image/number.png" />
                            <div className="show-number"> 剩余名额</div>
                        </div>

                        <span>{this.state.int}</span></div>
                    </div>
                    <img src="./assets21Intro/image/campaign.jpg" className="intro-img"/></div> }
                {/*如果已经报名，打开别人的分享链接时展示*/}
                {this.state.hasPaid && <div>
                    <div className="paid-bg" style={{height:window.innerHeight}}>
                        <div className="paid-text-box">
                            <p className="paid-text">恭喜你报名成功！</p>
                            {/*this.state.showWechatGroup && <div>
                                <p className="paid-text">扫码加小助手，拉你进群：</p>
                                <p className="paid-text">微信号：dahuilangshu</p>
                                <img src="build21Intro/dashu.jpg" className="dashu-img"/>
                            </div>*/}
                            {!this.state.showWechatGroup && <div>
                                <p className="paid-text">不要着急呦，还没开课呢！</p>
                                <p className="paid-texts  tada infinite animated">耐心等待</p>
                                <p className="paid-text">下一个百万富翁就是你</p>
                                <p className="paid-text">长按扫描下方二维码进入课程公号</p>
                                <div className="page-div">
                                    <img className="page-image" src="./assets21Intro/image/tousha-qrcode.jpg"/>
                                </div>

                            </div>}

                        </div>
                    </div>

                </div>}

                <div id="payCon"></div>

                <div>

                </div>
                {/**分享链接进入**/}
                {/*{this.state.buttonPrice == 6 &&*/}
                    {/*<div className="bottom-button" >*/}
                        {/*<span onClick={this.clickHandler} className={this.state.hasSenior==false ?"join-button":"whole-join-button"}>立即参加（<span className="full-price">￥9</span>  ￥6）</span>*/}
                        {/*{!this.state.hasSenior && <span className="share-button" onClick={this.shareModalHandler}>邀请好友</span>}*/}
                    {/*</div>*/}
                {/*}*/}

                {this.state.buttonPrice == 3.8 &&
                    <div className="bottom-button" >
                        {this.state.time ? <span onClick={this.didClickHandler}  className="join-button">报名截止下次再来吧</span> : <span onClick={this.clickHandler}  className={this.state.hasSenior==false ?"join-button":"whole-join-button"}>立即参加（￥3.8）</span>}

                        {/*{!this.state.hasSenior && <span className="share-button" onClick={this.shareModalHandler}>邀请好友</span>}*/}
                    </div>
                }

                {this.state.buttonPrice == 0 &&
                    <div className="bottom-button attend-camp-button">
                        {/*{!this.state.showWechatGroup && <span onClick={this.clickHandler} className={this.state.hasSenior==false ?"join-button":"whole-join-button"}>请等待开课</span>}*/}

                        {/*this.state.showWechatGroup && <span onClick={this.clickHandler} className={this.state.hasSenior==false ?"join-button":"whole-join-button"}>因人数较多，请耐心等待通过加群</span>*/}

                        {/*{!this.state.hasSenior && <span className="share-button" onClick={this.shareModalHandler}>邀请好友</span>}*/}
                    </div>
                }
                {/*{this.state.showShareHint && <div className="share-hint"></div>}*/}
                {/*{this.state.showShareHint && <div className="share-text"></div>}*/}

                {/*入页面时弹出的分享提示panel*/}
                {this.state.buttonChange && <Modal hideOnTap={false}><SharePanel onClose={this.closeSharePanelHandler}/></Modal>}
                {/*{this.state.firstSharePanel && <Modal hideOnTap={false}><SharePanel onClose={this.firstSharePanels}/></Modal>}*/}
                {/*{this.state.firstSharePanel && <Modal><FirstSharePanel /></Modal>}*/}
                {/*点击分享时的提示模态引导框*/}
                {/*{this.state.showShareModal && <img src="./assets21Intro/image/shareModal.png" onClick={this.hideShareModalHandler} className="share-modal"/>}*/}
            </div>
        )
    }

});

module.exports = PayPage;