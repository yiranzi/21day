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
            isSubscribed: true, //是否订阅
            showGuide: false, // 显示关注引导信息
            showShareHint: false, //显示分享
            QQNum: null, //QQ群号
            QQLink: null, //QQ群链接
            QQCode: null, //QQ暗号
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

            showint:true,//初始剩余人数

            endTime: Util.getEndTime(), // 截止时间


            num: 0,
            time: 0
        };
    },


    componentWillMount(){
        //0获取当前的
        let courseId = sessionStorage.getItem('courseId');
        OnFire.on('PAID_DONE', ()=>{
            Tools.fireRaceCourse(courseId).then((value)=>{
                if(value === 'pay'){
                    // alert("PAID_DONE已报名");

                    this.setState({
                        hasPaid: true, //已报名
                    });
                    OnFire.fire('PAID_SUCCESS','normalPay');
                } else if(value === 'free'){
                    this.setState({
                        hasPaid: false, //未报名
                    });
                }
            })
        });
        //已付费
        OnFire.on('PAID_SUCCESS',(payWay)=>{
            Tools.postData('支付成功');
            // 下线支付成功后上报
            let seniorId = Util.getUrlPara('ictchannel');
            this.checkSubscribe();
        });
        this.getUserId().then(()=>{
            let seniorId = Util.getUrlPara('ictchannel');
            Material.postData('人_进入_payPage');
            //获取用户是否有报名记录
            this.postRegisterRecord(User.getUserInfo());
            //设置订阅
            this.setSubscribeInfo(User.getUserInfo().subscribe);
            // 下线打开分享链接
            this.setSenior(seniorId,User.getUserInfo().userId);
        });
        //设置价格
    },

    setPrice() {
        let getWhere = sessionStorage.getItem('getWhere');
        if (getWhere === 'zl') {
            //设置价格
        }
    },

    getUserId() {
        let userId = User.getUserInfo().userId;
        return Tools.fireRace(userId,"OAUTH_SUCCESS");
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
     * 下线打开分享链接
     */
    setSenior(seniorId, userId) {
        //seniorId则表示该用户拥有上线
        if((seniorId && seniorId != userId)|| MyStorage.getItem('S','pathFrom') === 'ListenCourse') {
            let free = this.props.params.free;
            // TODO test roy
            // free = true;

            if (free) {
                this.setState({
                    hasSenior: true,
                });
            } else {
                this.setState({
                    hasSenior: true,
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
            Util.postCnzzData('拿不到用户数据');
            //提醒用户加付费群
            window.dialogAlertComp.show('提示','你好像被流星砸中...服务器君拿不到你的数据，请点击页面上的QQ群报名训练营','知道啦',()=>{},()=>{},false);
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
            this.setState({
                hasPaid: true,
            });
            this.scrollToTop();
            window.dialogAlertComp.show('报名成功','赶紧关注公众号"长投"，"长投"，"长投"，每天陪你一起学习哟~','好勒，知道了！',this.gotoSelectPage,()=>{},false);
            Util.postCnzzData("报名成功未关注公号");
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
        location.hash = 'course/10/free'
    }

});

module.exports = PayPage;
