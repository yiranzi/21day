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

var REMAIN_NUM = 1000;

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
            remain: parseInt(localStorage.getItem('remain-num'))||REMAIN_NUM, //剩余席位

            //21days2.0
            hasSenior: false, //是否有上线
            buttonPrice: Util.getNormalPrice(), //
            buttonChange:false,//判断提示时间截止panel
            //share
            showSharePanel: false, //显示分享panel
            showShareModal: false , //显示分享modal

            //wechat
            showWechatGroup: false, //显示微信联系方式
            firstSharePanel:false, //首次分享提示

            showint:true,//初始剩余人数

            endTime: Util.getEndTime(),
        };
    },


    componentWillMount(){
        // this.timeout();

        console.log("endTime:", this.state.endTime);

        //分享成功后，通知后台，给用户加红包
        OnFire.on('PAID_LOSER',()=>{
            this.setState({
                showBackup:true,
            })
        });
        //已付费
        OnFire.on('PAID_SUCCESS',(payWay)=>{
            let isSubscribed = User.getUserInfo().subscribe;
            console.log("支付完判断是否关注公号", isSubscribed);

            // 已关注公号的用户直接跳转关卡页面学习
            if (isSubscribed) {
              DoneToast.show('报名成功，开始学习第一课吧！');
              location.hash = "/select";
            } else { // 未关注引导关注公号
              this.setState({
                  hasPaid: true,
              })
              this.scrollToTop();
              DoneToast.show('报名成功，记得关注长投公号哦！');
            }

            //统计班主任信息
            // let teacherId = Util.getUrlPara('teacherid');
            // teacherId && Util.postCnzzData('班主任'+teacherId);

            //todo
            // window.dialogAlertComp.show('报名成功','点击“立即加群”进入QQ群。也可以复制页面上的QQ群号，手动进群。请注意页面上的加群【暗号】哟~','知道啦',()=>{},()=>{},false);
        });
        console.log('openid')
        let seniorId = Util.getUrlPara('ictchannel'),
            openId = User.getUserInfo().openId;

        if(openId) {
            //获取用户是否有报名记录
            this.postRegisterRecord(User.getUserInfo());

            //设置订阅
            this.setSubscribeInfo(User.getUserInfo().subscribe);

            // 下线打开分享链接
            this.setSenior(seniorId,User.getUserInfo().userId);

        }
        else{
            OnFire.on('OAUTH_SUCCESS',(userInfo)=>{
                //获取用户是否有报名记录
                this.postRegisterRecord(userInfo);

                //设置订阅
                this.setSubscribeInfo(userInfo.subscribe);

                // 下线打开分享链接
                this.setSenior(seniorId,userInfo.userId);
            });
        }
    },

    /***
     * 请求剩余报名人数和报名时间是否截止
     */
    signUpNumber(){
        Material.getRegistered().done((result) => {
            console.log('signUpNumber-result', result);
            // TODO test roy
            result.time = false;

            let restNum = Util.getUserNumber() - result.number;
            console.log("剩余人数：", restNum);

            if (restNum <= 0){
                this.setState({
                    num: 0,
                    time: result.time,
                    showint: false,
                    hasSenior: false
                });
            } else {
              this.setState({
                  num: restNum,
                  time: result.time,
                  showint: true,
                  hasSenior: false
              });
            }
        }).fail(()=>{

        });


    },

    /**
     * 下线打开分享链接
     */
    setSenior(seniorId, userId) {
        //seniorId则表示该用户拥有上线
        if(seniorId && seniorId != userId) {
            this.setState({
                hasSenior: true,
                buttonPrice: Util.getCheapPrice()
            });

            console.log("下线打开分享链接");
            Util.postCnzzData("下线打开分享链接");
        } else {
            this.setState({
                buttonPrice: Util.getNormalPrice()
            });
            // 请求倒计时和剩余人数
            this.signUpNumber();
        }
    },

    /**
     * 发送是否报名请求
     * @param termId
     * @param userInfo
     * @param payWay
     */
    postRegisterRecord (userInfo, payWay) {
        Loading.showLoading('获取信息...');

        console.log('是否报名'+'userInfo',userInfo);

        Material.getJudgeFromServer().done((record)=>{
            Loading.hideLoading();
            console.log('是否报名', record);

            // TODO test roy
            // record = true;
            alert("是否报名：" + record);

            if(record){
                this.setState({
                    hasPaid: true, //已报名
                });

                // OnFire.on('OAUTH_SUCCESS',(userInfo)=>{
                //     console.log('OAUTH_SUCCESS-userInfo',userInfo);
                //     //获取用户是否有报名记录
                //     console.log('1')
                //     this.postRegisterRecord(userInfo);
                //
                //     //设置订阅
                //     this.setSubscribeInfo(userInfo.subscribe);
                //
                //     //设置上线
                //     // this.setSenior(seniorId,userInfo.userId);
                // });
            } else {
                this.setState({
                    hasPaid: false, //未报名
                });
            }
        })
        .fail(()=>{
            Loading.hideLoading();
            this.setState({
                hasPaid: false, //未报名
            })
        })
    },

    /**
     * 设置用户关注信息
     * @param subscribe
     */
    setSubscribeInfo(subscribe){

        this.setState({
            isSubscribed: subscribe,
            followSubscribe:subscribe,
        });
        console.log('isSubscribed', subscribe);
    },

    /**
     * 按钮点击
     */
    clickHandler() {
        this.payHandler();
    },


    /**
     * 支付动作
     */
    payHandler() {
        console.log('支付动作')
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
        Util.postCnzzData('报名截止后点击报名');
        this.setState({
            buttonChange:true,
        })
    },

    getTime(){
        this.signUpNumber();
    },

    render(){
        return (
            <div className="pay_page">

                {/*。。。。。从上线发的链接打开时展示*/}
                {/*{this.state.hasSenior && <SeniorInfo/>}*/}

                {/*点击报名但没有查到用户信息时提示加群*/}
                {this.state.showBackup && <a className="backup-text" href="http://jq.qq.com/?_wv=1027&k=41976jN">QQ群号：
                    <span className="red-text">429827363</span>
                    <p className="red-text  tada animated infinite">暗号：7天</p></a>}
                {/*如果未报名，并且不是下线，则显示报名时间和人数*/}
                {!this.state.hasPaid &&
                <div>
                   {!this.state.hasSenior && <div>
                     <div className="top-time-bottom">
                         <div className="top-time">
                             <Timeout hasEnded={this.state.time} finalDate={this.state.endTime}/>
                         </div>
                     <div className="entered">
                         <div className="show-entered">
                             <img src="./assets7Intro/image/number.png" />
                             <div className="show-number"> 剩余名额</div>
                         </div>
                         {/*<span>0</span>*/}
                         {this.state.showint ? <span>{this.state.num}</span>:<span>0</span>}
                         </div>
                     </div>
                   </div>}

                    <img src="./assets7Intro/image/campaign.jpg" className="intro-img"/></div> }
                {/*如果已经报名，报名链接时展示*/}
                {this.state.hasPaid && <div>
                    <div className="paid-bg" style={{height:window.innerHeight}}>
                        <div className="paid-text-box">
                            <p className="paid-text">报名成功！</p>
                            {/*this.state.showWechatGroup && <div>
                                <p className="paid-text">扫码加小助手，拉你进群：</p>
                                <p className="paid-text">微信号：dahuilangshu</p>
                                <img src="build21Intro/dashu.jpg" className="dashu-img"/>
                            </div>*/}
                            {!this.state.showWechatGroup && <div>

                                <p className="paid-text paid-times"></p>
                                {/*<p className="paid-texts  tada infinite ">耐心等待</p>*/}
                                <p className="paid-text">下一个百万富翁就是你</p>
                                {!this.state.followSubscribe && <div><p className="paid-text">长按扫描下方二维码进入课程公号，开始学习吧</p>
                                <div className="page-div">
                                    <img className="page-image" src="./assets7Intro/image/tousha-qrcode.jpg"/>
                                    </div></div>}

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

                {!this.state.hasPaid &&
                    <div className="bottom-button" onClick={this.getTime}>
                        {(this.state.time && !this.state.hasSenior) ? <span onClick={this.didClickHandler}  className="join-button">报名截止下次再来吧</span> : <span onClick={this.clickHandler}  className={!this.state.hasSenior ?"join-button":"whole-join-button"}>立即参加（￥{this.state.buttonPrice}）</span>}
                        {/**/}
                        // {/*{!this.state.hasSenior && <span className="share-button" onClick={this.shareModalHandler}>邀请好友</span>}*/}
                    </div>
                }

                {/*入页面时弹出的分享提示panel*/}
                {this.state.buttonChange && <Modal hideOnTap={false}><SharePanel onClose={this.closeSharePanelHandler}/></Modal>}
                </div>
        )
    }

});

module.exports = PayPage;
