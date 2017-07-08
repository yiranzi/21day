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
            buttonPrice: Util.getPrice(), //

            //wechat
            showWechatGroup: false, //显示微信联系方式

            showint:true,//初始剩余人数

            endTime: Util.getEndTime(), // 截止时间


            num: 0,
            time: 0
        };
    },


    componentWillMount(){
        sessionStorage.setItem('pathNow','支付');

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

                if(sessionStorage.getItem('channel')) {
                    if (User.getUserInfo().userId) {
                        Material.postData(sessionStorage.getItem('channel') + '_支付成功_' + User.getUserInfo().userId);
                    } else {
                        OnFire.on('OAUTH_SUCCESS', ()=>{
                            //1.判断听课状态.
                            Material.postData(sessionStorage.getItem('channel') + '_支付成功_' + User.getUserInfo().userId);
                        });
                    }
                }


                this.setState({
                    hasPaid: true, //已报名
                });
                this.state.hasPaid = true;
                this.checkSubscribe();
            });
        }
        //3设置下线和价格
        this.setIfCanPaid();
        //5请求倒计时和剩余人数
        this.signUpNumber();
    },

    getUserId() {
        let userId = User.getUserInfo().userId;
        return Tools.fireRace(userId,"OAUTH_SUCCESS");
    },

    setIfCanPaid() {
        let seniorId = sessionStorage.getItem('ictchannel');
        Util.setPrice(680);
        //下线进入界面
        if(seniorId){
            this.state.hasSenior = true;
            this.state.ifCanPaid = true;
            //seniorId则表示该用户拥有上线
            let channel =sessionStorage.getItem('channel');
            if(channel) {
                //合伙人进入报名页上报
                if (User.getUserInfo().userId) {
                    Material.postData(channel + '_进入页面_' + User.getUserInfo().userId);
                } else {
                    OnFire.on('OAUTH_SUCCESS', () => {
                        //1.判断听课状态.
                        Material.postData(channel + '_进入页面_' + User.getUserInfo().userId);
                    });
                }
                //区分优惠类型
                if(channel === 'typeB') {
                    Util.setPrice(630);
                } else {
                    Util.setPrice(580);
                }
            }
        }
        //试听进入
        if(sessionStorage.getItem('pathFrom') === 'ListenCourse') {
            this.state.ifCanPaid = true;
        }
        this.setState({
            hasSenior: this.state.hasSenior,
            ifCanPaid: this.state.ifCanPaid,
            buttonPrice: Util.getPrice(),
        });
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
                    num: 59 + restNum,
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
        Tools.MyRouter('CourseSelect','/courseSelect/');
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
                    <img src="./assetsPlus/image/fund/join-title.png" alt="" className="fund-join-title"/>
                    <div className="fund-join-content-box">
                        <img src="./assetsPlus/image/fund/join-content.png" alt="" className="fund-join-content"/>
                        {!this.state.hasSenior &&
                        <div className="fund-status">
                            <Timeout hasEnded={this.state.time} finalDate={this.state.endTime}/>
                            <span className="fund-status-number">剩余名额：{this.state.showint ? this.state.num : 0}</span>
                        </div>
                        }
                    </div>
                    {this.bottomBar()}
                    <div className="global-empty-div" style={{height: 70}}>123</div>
                </div>
            </div>
        )
    },

    bottomBar() {
        return(<div className="global-div-fixed">
            <div className="fund-join-btns">
                {this.buttonLesson()}
                {this.buttonSignUp()}
            </div>
        </div>)
    },

    buttonLesson() {
        return(<span className="btn try" onClick={this.freeLesson}>试听</span>)
    },

    buttonSignUp() {
        if(this.state.hasSenior || (!this.state.time && (this.state.num > 0))){
            return(<span className="btn join" onClick={this.clickHandler}>{this.renderPrice()}</span>)
        } else {
            return(<span className="btn join" onClick={this.onWantJoinTap}><span>还想报名？点我</span></span>)
        }

    },

    renderPrice() {
        let arr = [];
        let channel  = sessionStorage.getItem('channel');
        if(!channel) {
            arr.push(<div className="price-span-right"><s className="price-span-inner origin-price">原价¥{780}</s><span className="price-span-inner current-price">现价¥{this.state.buttonPrice}</span></div>);
        } else {
            arr.push(<div className="price-span-right"><s className="price-span-inner origin-price">原价¥{780}</s><span className="price-span-inner current-price">友情价¥{this.state.buttonPrice}</span></div>);
        }
        return arr;
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
