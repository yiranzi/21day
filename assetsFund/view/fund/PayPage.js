/**
 * Created by Administrator on 16-8-2.
 */
var React = require('react');
var $ = require('jquery');
var OnFire =require('onfire.js');

var User = require('../../User');
var Dimensions = require('../../Dimensions');
var PayController = require('../../PayController');
var Util = require('../../Util');
var Material = require('../../Material');
var Loading = require('../../Loading');
var DoneToast = require('../../component/DoneToast');
const Timeout = require('../../component/Timeout');

const FixedBg = require('../../component/course/FixedBg');

//之后做成全局的.
const MyStorage = require('../../GlobalFunc/MyStorage');

const Tools = require('../../GlobalFunc/Tools');

var PayPage = React.createClass({

    getInitialState(){
        return {
            hasPaid:false, //是否付费
            ifCanPaid: false,
            showGuide: false, // 显示关注引导信息
            showShareHint: false, //显示分享
            QQNum: null, //QQ群号
            QQLink: null, //QQ群链接
            QQCode: null, //QQ暗号
            remain: parseInt(localStorage.getItem('remain-num')) || Util.getUserNumber(), //剩余席位

            //21days2.0
            hasSenior: false, //是否有上线
            buttonPrice: Util.getNormalPrice(), //

            //wechat
            showWechatGroup: false, //显示微信联系方式

            showint:true,//初始剩余人数

            endTime: Util.getEndTime(), // 截止时间


            num: 0,
            time: 0
        };
    },


    componentWillMount(){
        Material.postData('人_进入_payPage');
        //0获取当前的Id
        let courseId = sessionStorage.getItem('courseId');
        //1获取用户名 获取报名信息
        this.getUserId().then(()=>{
            //获取用户是否有报名记录
            Tools.fireRaceCourse(courseId).then((value)=>{
                if(value === 'pay'){
                    this.setState({
                        hasPaid: true, //已报名
                    });
                } else if(value === 'free'){
                    this.setState({
                        hasPaid: false, //未报名
                    });
                }
            });
        });
        //2监听支付完成 通往听课
        let outBool = false;
        while(!outBool) {
            outBool = true;
            OnFire.on('PAID_DONE', ()=>{
                Tools.fireRaceCourse(courseId).then((value)=>{
                    if(value === 'pay'){
                        OnFire.fire('PAID_SUCCESS','normalPay');
                    } else {
                        outBool = false;
                    }
                })
            });
            OnFire.on('PAID_SUCCESS',(payWay)=>{
                Tools.postData('支付成功');
                this.setState({
                    hasPaid: true, //已报名
                });
                this.state.hasPaid = true;
                this.checkSubscribe();
            });
        }
        //3设置下线
        this.setIfCanPaid();
        //5请求倒计时和剩余人数
        this.signUpNumber();
        //6设置价格
        this.setPrice();
    },

    getUserId() {
        let userId = User.getUserInfo().userId;
        return Tools.fireRace(userId,"OAUTH_SUCCESS");
    },

    setPrice() {
        let getWhere = sessionStorage.getItem('getWhere');
        //特殊渠道设置价格
        if (getWhere === 'zl') {
            Util.getNormalPrice()
        } else {
            Util.getCheapPrice()
        }
    },

    setIfCanPaid() {
        let seniorId = sessionStorage.getItem('ictchannel');
        //seniorId则表示该用户拥有上线
        if(seniorId){
            this.state.ifCanPaid = true;
        }
        if(sessionStorage.getItem('pathFrom') === 'ListenCourse') {
            this.state.ifCanPaid = true;
        }
        if(sessionStorage.getItem('getWhere') === 'zl') {
            this.state.ifCanPaid = true;
        }
    },

    /***
     * 请求剩余报名人数和报名时间是否截止
     */
    signUpNumber(){
        Material.getRegistered().done((result) => {
            let restNum = Util.getUserNumber() - result.number;
            if (restNum <= 0){
                this.setState({
                    num: 0,
                    time: result.time,
                    showint: false,
                });
            } else {
                this.setState({
                    num: restNum,
                    time: result.time,
                    showint: true,
                });
            }
        }).fail(()=>{

        });


    },


    /**
     * 按钮点击
     */
    clickHandler() {
        if (this.state.hasSenior) {
            Util.postCnzzData('下线_点击报名_payPage');
            Material.postData('下线_点击报名_payPage');
        } else {
            Util.postCnzzData('人_点击报名_payPage');
            Material.postData('人_点击报名_payPage');
        }
        this.payHandler();
    },

    onWantJoinTap () {
        window.dialogAlertComp.show('告诉你个小秘密','请好友分享给你后，你可以无视截止时间的限制，想报名就报名~','快去试试吧',()=>{},()=>{},false);
    },

    /**
     * 支付动作
     */
    payHandler() {
        if(User.getUserInfo().userId){
            //微信支付
            PayController.wechatPay();
        }else{
            this.scrollToTop();
            window.dialogAlertComp.show('提示','重新进入一下再试试，还不行的话可以报告管理员.手机号：15652778863','知道啦',()=>{},'',false);
        }
    },

    scrollToTop() {
        scrollTo(0,0);
    },

    /**
     * 跳转到关卡页面
     */
    gotoSelectPage() {
        location.hash = "/select";
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
        // 已关注公号的用户直接跳转关卡页面学习
        if (isSubscribed) {
            DoneToast.show('报名成功，开始学习第一课吧！');
            this.gotoSelectPage();
        } else { // 未关注引导关注公号
            this.scrollToTop();
            window.dialogAlertComp.show('报名成功','赶紧关注公众号"长投"，"长投"，"长投"，每天陪你一起学习哟~','好勒，知道了！',this.gotoSelectPage,()=>{},false);
        }
    },

    render(){
        return (
            <div className="pay_page">
                <FixedBg/>
                <div className="fund-join-page">
                    <img src="./assetsFund/image/fundJoin/join-title.png" alt="" className="fund-join-title"/>
                    <div className="fund-join-content-box">
                        <img src="./assetsFund/image/fundJoin/join-content.png" alt="" className="fund-join-content"/>
                        {!this.state.hasSenior &&
                        <div className="fund-status">
                            <Timeout hasEnded={this.state.time} finalDate={this.state.endTime}/>
                            <span className="fund-status-number">剩余名额：{this.state.showint ? this.state.num : 0}</span>
                        </div>
                        }
                    </div>
                    <div className="fund-join-btns">
                        <span className="btn try" onClick={this.freeLesson}>试听</span>
                        {
                            (this.state.hasSenior || (!this.state.time && (this.state.num > 0))) ?
                                <span className="btn join" onClick={this.clickHandler}><span>报名</span><span>(￥{this.state.buttonPrice})</span></span> :
                                <span className="btn join" onClick={this.onWantJoinTap}><span>还想报名？点我</span></span>

                        }
                    </div>
                </div>
            </div>
        )
    },

    freeLesson() {
        // location.hash = '/select';
        if (this.state.hasSenior) {
            Material.postData('下线_点击试听_payPage');
        } else {
            Material.postData('人_点击试听_payPage');
        }
        Tools.MyRouter('ListenCourse','/listenCourse/10');
    }

});

module.exports = PayPage;
