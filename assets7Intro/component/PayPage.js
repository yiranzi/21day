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
            remain: parseInt(localStorage.getItem('remain-num')) || Util.getUserNumber(), //剩余席位

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

            endTime: Util.getEndTime(), // 截止时间

            isFreeUser: false, // 是否免费用户

            num: 0,
            time: 0
        };
    },


    componentWillMount(){

        Util.postCnzzData("进入报名页面");

        console.log("endTime:", this.state.endTime);

        OnFire.on('PAID_DONE', ()=>{
          Material.getJudgeFromServer().done((record)=>{
              // TODO test roy
              // record = true;

              if(record){
                // alert("PAID_DONE已报名");

                  this.setState({
                      hasPaid: true, //已报名
                  });
                  OnFire.fire('PAID_SUCCESS','normalPay');
              } else {
                // alert("PAID_DONE未报名");

                  this.setState({
                      hasPaid: false, //未报名
                  });
                  Util.postCnzzData('点击取消付费');
              }
          })
          .fail(()=>{
              Loading.hideLoading();
              this.setState({
                  hasPaid: false, //未报名
              })
          })
        });

        //分享成功后，通知后台，给用户加红包
        OnFire.on('PAID_LOSER',()=>{
            this.setState({
                showBackup:true,
            })
        });
        //已付费
        OnFire.on('PAID_SUCCESS',(payWay)=>{
          // alert("报名成功");

          // 下线支付成功后上报
          let seniorId = Util.getUrlPara('ictchannel');

          if(seniorId && seniorId != User.getUserInfo().userId) {
              Util.postCnzzData("下线报名成功");

              // alert("下线报名成功");
          }

          Util.postCnzzData('报名成功');

          this.checkSubscribe();
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
            Material.postData('人_进入_payPage');
            //获取用户是否有报名记录
            this.postRegisterRecord(User.getUserInfo());

            //设置订阅
            this.setSubscribeInfo(User.getUserInfo().subscribe);

            // 下线打开分享链接
            this.setSenior(seniorId,User.getUserInfo().userId);

        }
        else{
            OnFire.on('OAUTH_SUCCESS',(userInfo)=>{
                Material.postData('人_进入_payPage');
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
            // result.time = false;

            let restNum = Util.getUserNumber() - result.number;

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
            Material.postData('下线_进入_payPage');
            let free = this.props.params.free;
            console.log("是否免费用户", free);
            // TODO test roy
            // free = true;

            if (free) {
              this.setState({
                  hasSenior: true,
                  isFreeUser: true
              });

              console.log("免费用户进入报名页");
              Util.postCnzzData("免费用户进入报名页");
            } else {
              this.setState({
                  hasSenior: true,
                  isFreeUser: false,
                  buttonPrice: Util.getCheapPrice()
              });

              console.log("下线打开分享链接");
              Util.postCnzzData("下线打开分享链接");
            }
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
            // alert("是否报名：" + record);

            if(record){
                if (!this.state.isFreeUser) {
                  this.setState({
                      hasPaid: true, //已报名
                  });
                } else {
                  this.setState({
                      hasPaid: false, //未报名
                  });
                }

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

    /**
     * 跳转到关卡页面
     */
    gotoSelectPage() {
      // location.hash = "/select";
      let ictChannel = Util.getUrlPara("ictchannel");
      if (ictChannel) {
        location.href = Util.getHtmlUrl() + "?ictchannel=" + Util.getUrlPara("");
      } else {
        location.href = Util.getHtmlUrl();
      }
    },

    /**
     * 检测购买后是否关注公号
     */
    checkSubscribe () {
      let isSubscribed = User.getUserInfo().subscribe;
      console.log("支付完判断是否关注公号", isSubscribed);

      // 已关注公号的用户直接跳转关卡页面学习
      if (isSubscribed) {
        DoneToast.show('报名成功，开始学习第一课吧！');
        this.gotoSelectPage();
      } else { // 未关注引导关注公号
        this.setState({
            hasPaid: true,
        });
        this.scrollToTop();
        DoneToast.show('报名成功，记得关注长投公号哦！');

        Util.postCnzzData("报名成功未关注公号");
      }
    },

    /**
     * 显示shareModal操作
     */
    shareModalHandler() {
        var speed=10;//滑动的速度
        $('body,html').animate({ scrollTop: 0 }, speed);
        this.setState({
            showShareModal: true
        })
    },

    hideShareModalHandler() {
        this.setState({
            showShareModal: false
        })
    },

    render(){
        return (
            <div className="pay_page">
                <div className="fund-join-page">
                    <img src="./assets7Intro/image/fundJoin/join-bg.jpg " alt="" className="fund-join-bg"/>
                    <img src="./assets7Intro/image/fundJoin/join-title.png" alt="" className="fund-join-title"/>
                    <img src="./assets7Intro/image/fundJoin/join-content.png" alt="" className="fund-join-content"/>
                    {
                        <div className="fund-status">
                            {/*<span className="fund-status-sell">倒计时：{this.state.endTime}</span>*/}
                            <Timeout hasEnded={this.state.time} finalDate={this.state.endTime}/>
                            <span className="fund-status-sell">剩余名额：{this.state.showint ? this.state.remain-this.state.num : 0}</span>
                        </div>
                    }
                    <div className="fund-join-btns">
                        <span className="btn try" onClick={this.freeLesson}>试听</span>
                        {
                            !this.state.hasSenior &&
                            <span className="btn join" onClick={this.clickHandler}>
                                    <span>还想报名？点我</span>
                                </span>
                        }
                        {
                            this.state.hasSenior || (!this.state.time && (this.state.remain-this.state.num > 0)) &&
                            <span className="btn join" onClick={this.clickHandler}>
                                    <span>报名</span><span>(￥{this.state.buttonPrice})</span>
                                </span>
                        }
                    </div>
                </div>
            </div>
        )
    },

    freeLesson() {
        // location.hash = '/select';
        location.hash = 'course/1/free'
    }

});

module.exports = PayPage;
