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
const Modal = require('./Modal');

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
            buttonPrice: 9, //

            //share
            showSharePanel: false, //显示分享panel
            showShareModal: false , //显示分享modal

            //wechat
            showWechatGroup: false //显示微信联系方式
        };
    },


    componentWillMount(){
        //分享成功后，通知后台，给用户加红包
        OnFire.on('SHARE_SUCCESS',this.onShareSuccess);


        //已付费
        OnFire.on('PAID_SUCCESS',(payWay)=>{
            if(!this.state.QQNum){
                //查询报名
                this.postRegisterRecord(Util.getCurrentBatch(),User.getUserInfo(),payWay)
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
            let teacherId = Util.getUrlPara('teacherid');
            teacherId && Util.postCnzzData('班主任'+teacherId);

            //购买成功后的dialog
            DoneToast.show('报名成功');

            //todo
            window.dialogAlertComp.show('报名成功','点击“立即加群”进入QQ群。也可以复制页面上的QQ群号，手动进群。请注意页面上的加群【暗号】哟~','知道啦',()=>{},()=>{},false);
        });

        let seniorId = Util.getUrlPara('ictchannel'),
            openId = User.getUserInfo().openId;

        if(openId){
            //获取用户是否有报名记录
            //(同时绑定上下线关系，因为要在加入21天表后，才可以有后续行为)
            this.postRegisterRecord(Util.getCurrentBatch(),User.getUserInfo());

            //设置订阅
            this.setSubscribeInfo(User.getUserInfo().subscribe);

            //设置上线
            this.setSenior(seniorId,User.getUserInfo().userId);

        }
        else{
            OnFire.on('OAUTH_SUCCESS',(userInfo)=>{
                //获取用户是否有报名记录
                this.postRegisterRecord(Util.getCurrentBatch(),userInfo);

                //设置订阅
                this.setSubscribeInfo(userInfo.subscribe);

                //设置上线
                this.setSenior(seniorId,userInfo.userId);
            });
        }

        this.forSeniors();
    },


    /**
     * 分享成功时的操作
     */
    onShareSuccess() {
        let userInfo = User.getUserInfo();

        if(userInfo.userId){
            Material.getFirstShare(userInfo.userId);
        }else{
            console.log('用户没有登录');
        }
    },

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
            this.setState({
                hasSenior: true,
                buttonPrice: 6
            });
        }
    },




    /**
     * 发送是否报名请求
     * @param termId
     * @param userInfo
     * @param payWay
     */
    postRegisterRecord (termId,userInfo,payWay) {
        Loading.showLoading('获取信息...');

        Material.getRegisterRecord(termId,userInfo.userId).done((record)=>{

            Loading.hideLoading();

            if(record && record.qqGroup){

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


            }else if(payWay=='normalPay'){
                console.log('normalPay');
                //设置备选QQ群
                this.setBackUpQQState();
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
            case 9:
            case 6: this.payHandler();
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
                showBackup: false
            });

            //微信支付
            PayController.wechatPay();
        }else{
            this.setState({
                showBackup: true,
                buttonPrice: 0,
                QQLink:'http://jq.qq.com/?_wv=1027&k=41976jN' //非付费的QQ群号
            });

            this.scrollToTop();

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
    entryQQClickHandler(){
        Util.postCnzzData('点击进入QQ群');

        //QQ
        location.href = this.state.QQLink;

    },

    /**
     * 邀请好友
     */
    entryPosterHandler() {
        Util.postCnzzData('邀请好友');

        //置顶
        scrollTo(0, 0);

        this.setState({
            showShareHint: true
        });
    },

    /**
     * 隐藏分享panel
     */
    closeSharePanelHandler() {
        this.setState({
            showSharePanel: false
        });
    },

    /**
     * 显示shareModal操作
     */
    shareModalHandler() {
        this.setState({
            showShareModal: true
        })
    },

    /**
     * 隐藏分享modal
     */
    hideShareModalHandler() {
        this.setState({
            showShareModal: false
        })
    },

    render(){
        return (
            <div className="pay_page">
                {this.state.hasSenior && <SeniorInfo/>}

                {this.state.showBackup && <a className="backup-text" href="http://jq.qq.com/?_wv=1027&k=41976jN">QQ群号：
                    <span className="red-text">239360505</span>
                    <p className="red-text  tada animated infinite">暗号：理财</p></a>}

                {!this.state.hasPaid && <img src="./assets21Intro/image/intro.jpg" className="intro-img"/>}

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
                                <p className="paid-text">请加QQ群号：<span className="red-text">{this.state.QQNum}</span></p>
                                <p className="paid-text  tada infinite animated">群暗号：<span className="red-text">{this.state.QQCode}</span></p>
                                <p className="paid-text">请于2小时内尽快加群</p>
                            </div>}

                        </div>
                    </div>

                </div>}

                <div id="payCon"></div>

                <div>

                </div>

                {this.state.buttonPrice == 6 &&
                    <div className="bottom-button" >
                        <span onClick={this.clickHandler} className={this.state.hasSenior==false ?"join-button":"whole-join-button"}>立即参加（<span className="full-price">￥9</span>  ￥6）</span>
                        {!this.state.hasSenior && <span className="share-button" onClick={this.shareModalHandler}>邀请好友</span>}
                    </div>
                }

                {this.state.buttonPrice == 9 &&
                    <div className="bottom-button" >
                        <span onClick={this.clickHandler}  className={this.state.hasSenior==false ?"join-button":"whole-join-button"}>立即参加（￥9）</span>
                        {!this.state.hasSenior && <span className="share-button" onClick={this.shareModalHandler}>邀请好友</span>}
                    </div>
                }

                {this.state.buttonPrice == 0 &&
                    <div className="bottom-button attend-camp-button">
                        {!this.state.showWechatGroup && <span onClick={this.clickHandler} className={this.state.hasSenior==false ?"join-button":"whole-join-button"}>进入训练营</span>}

                        {/*this.state.showWechatGroup && <span onClick={this.clickHandler} className={this.state.hasSenior==false ?"join-button":"whole-join-button"}>因人数较多，请耐心等待通过加群</span>*/}

                        {!this.state.hasSenior && <span className="share-button" onClick={this.shareModalHandler}>邀请好友</span>}
                    </div>
                }

                {this.state.showShareHint && <div className="share-hint"></div>}
                {this.state.showShareHint && <div className="share-text"></div>}

                {this.state.showSharePanel && <Modal hideOnTap={false}><SharePanel onClose={this.closeSharePanelHandler}/></Modal>}
                {this.state.showShareModal && <img src="./assets21Intro/image/shareModal.png" onClick={this.hideShareModalHandler} className="share-modal"/>}
            </div>
        )
    }

});

module.exports = PayPage;