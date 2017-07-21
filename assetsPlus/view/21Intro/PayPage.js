/**
 * Created by ichangtou on 2017/7/19.
 */
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
const WxConfig = require('../../WxConfig');

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

            endTime:[2017,7,25,9,0,0], // 截止时间


            num: 0,
            time: 0,
            hhrChannel: false,

            //21天的报名信息
            // signUpInfo: {}
        };
    },


    componentWillMount(){
        //设置分享
        let wxshare = sessionStorage.getItem('wxshare');
        Tools.fireRace(wxshare,"wxshare").then(()=>{
            this.setShareConfig();
        });
        Statistics.postDplusData('enter');
        //0获取当前的Id
        let courseId = sessionStorage.getItem('courseId');
        //1获取用户名 获取报名信息
        this.getUserId().then(()=>{
            //获取用户是否有报名记录
            Tools.fireRaceCourse(courseId).then((value)=>{
                if(value.pay){
                    this.setState({
                        // signUpInfo: value,
                        hasPaid: true, //已报名
                    });
                } else{
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
            //首先接收到付款结束.
            OnFire.on('PAID_DONE', ()=>{
                console.log('get done');
                if (sessionStorage.getItem('courseId') !== courseId) {
                    return
                }
                //先ajax更新这个数据(花费少量时间)
                Tools.updataCourseData(courseId).then((value)=>{
                    if(value.pay){
                        // this.state.signUpInfo = value;
                        OnFire.fire('PAID_SUCCESS','normalPay');
                    } else {
                        outBool = false;
                    }
                })
            });
            OnFire.on('PAID_SUCCESS',(payWay)=>{
                if (sessionStorage.getItem('courseId') !== courseId) {
                    return
                }
                Statistics.postDplusData('paySuccess');
                this.state.hasPaid = true;
                this.setState({
                    // signUpInfo: this.state.signUpInfo,
                    hasPaid: true, //已报名
                });
                this.checkSubscribe();
            });
        }
        //3设置下线和价格
        this.setIfCanPaid();
        //5请求倒计时和剩余人数
        this.signUpNumber();
    },

    setShareConfig() {
        let shareTitle = '经过',
            link = Util.getShareLink(),
            desc = '快来';
        link = link + '&goPath=' + 'payPage';
        link = link + '&courseId=' + sessionStorage.getItem('courseId');
        WxConfig.shareConfig(shareTitle,desc,link);
    },

    ifHhrChannel() {
        let seniorId = Util.getUrlPara("ictchannel");
        let channel = Util.getUrlPara("getWhere");
        if(seniorId && channel) {
            this.state.hhrChannel = true;
            this.setState({hhrChannel: this.state.hhrChannel});
        }
    },

    getUserId() {
        let userId = User.getUserInfo().userId;
        return Tools.fireRace(userId,"OAUTH_SUCCESS");
    },

    setIfCanPaid() {
        Util.setPrice(1);
        this.setState({
            ifCanPaid: this.state.ifCanPaid,
            buttonPrice: Util.getPrice(),
        });
    },

    /***
     * 请求剩余报名人数和报名时间是否截止
     */
    signUpNumber(){
        Material.getRegistered21().done((result) =>{
            console.log(result);
            //设置报名时间
            result.time = false;// 一定可以报名
            //设置剩余人数
            let restNum = Util.getUserNumber() - result.leftQuota;
            if(!result.time && (restNum > 0)) {
                this.state.ifCanPaid = true;
            }
            //设置报名人数/时间等属性
            if (restNum <= 0){
                this.setState({
                    num: 0,
                    time: result.time,
                    showint: false,
                    ifCanPaid: false,
                });
            } else {
                this.setState({
                    num: restNum,
                    time: result.time,
                    showint: true,
                    ifCanPaid: true,
                });
            }
            this.setState({
                endTime: [2017,7,25,9,0,0],
            });

        });
    },

    goRouter() {
        console.log("goRouter");
        let ictChannel = Util.getUrlPara("ictchannel");
        if (ictChannel) {
            location.href = Util.getHtmlUrl() + "?ictchannel=" + Util.getUrlPara("");
        } else {
            location.href = Util.getHtmlUrl();
        }
    },

    /**
     * 支付动作
     */
    payHandler() {
        console.log('click');
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
            //TODO 加qq群号.的弹窗.
            // 重新请求.
            this.signUpNumber()
            //TODO 显示报名开课证(跳转)
            //TODo 上下线
            // this.gotoSelectPage();
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
                        <div className="fund-status">
                            <Timeout hasEnded={this.state.time} finalDate={this.state.endTime}/>
                            <span className="fund-status-number">剩余名额：{this.state.ifCanPaid ? this.state.num : 0}</span>
                        </div>
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
                {this.renderButtonSignUp()}
                {this.renderButtonShare()}
            </div>
        </div>)
    },

    renderButtonSignUp() {
        if(!this.state.hasPaid){
            //报名按钮
            return(<span className="btn try" onClick={this.clickHandler}>我要报名　（{this.state.buttonPrice}元）</span>)
        } else {
            //查看毕业证按钮
            return(<span className="btn try" onClick={this.onSeeReward}>我的开课证</span>)
        }

    },

    renderButtonShare() {
        Statistics.postDplusData('rewardButton');
        return(<img className="btn join" style={{lineHeight: '2.8rem'}} onClick={this.onSeeReward}/>)
    },

    onSeeReward () {
        //TODO 跳转到成就卡界面
        Statistics.postDplusData('shareButton');
        Tools.MyRouter('ListenCourse','/listenCourse/10');
    },

    /**
     * 按钮点击
     */
    clickHandler() {
        if(this.state.ifCanPaid) {
            this.payHandler();
        } else {
            window.dialogAlertComp.show('报名失败','出故障了.重新进入一下再试试，还不行的话可以报告管理员.手机号：15652778863','知道啦',()=>{},'',false);
        }

    },


    // buttonSignUp() {
    //     if(!this.state.hasPaid){
    //         //报名按钮
    //         return(<span className="btn join" onClick={this.clickHandler}>{this.renderPrice()}</span>)
    //     } else {
    //         //查看毕业证按钮
    //         return(<span className="btn join" onClick={this.onSeeReward}><span style={{lineHeight: '2.8rem'}}>查看开课</span></span>)
    //     }
    //
    // },

    // renderPrice() {
    //     let arr = [];
    //     if(!this.state.hhrChannel) {
    //         arr.push(<div className="price-span-right"><s className="price-span-inner origin-price">原价¥{20}</s><span className="price-span-inner current-price">现价¥{this.state.buttonPrice}</span></div>);
    //     } else {
    //         arr.push(<div className="price-span-right"><s className="price-span-inner origin-price">原价¥{200}</s><span className="price-span-inner current-price">友情价¥{this.state.buttonPrice}</span></div>);
    //     }
    //     return arr;
    // },

    // freeLesson() {
    //     //TODO 分享给好友
    //     Statistics.postDplusData('shareButton');
    //     Tools.MyRouter('ListenCourse','/listenCourse/10');
    // }

});

module.exports = PayPage;
