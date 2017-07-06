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
            this.state.hasSenior = true;
            this.state.ifCanPaid = true;
        }
        if(sessionStorage.getItem('pathFrom') === 'ListenCourse') {
            this.state.ifCanPaid = true;
        }
        if(sessionStorage.getItem('getWhere') === 'zl') {
            this.state.ifCanPaid = true;
        }
        this.setState({
            hasSenior: this.state.hasSenior,
            ifCanPaid: this.state.ifCanPaid,
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

                {/*。。。。从上线发的链接打开时展示*/}
                {/*{this.state.hasSenior && <SeniorInfo/>}*/}
                {/*删除掉无用的逻辑*/}
                {/*点击报名但没有查到用户信息时提示加群*/}
                {/*{this.state.showBackup && <a className="backup-text" href="http://jq.qq.com/?_wv=1027&k=41976jN">QQ群号：*/}
                {/*<span className="red-text">429827363</span>*/}
                {/*<p className="red-text  tada animated infinite">暗号：7天</p></a>}*/}
                {/*如果未报名，并且不是下线，则显示报名时间和人数*/}
                {!this.state.hasPaid &&
                <div>
                    {/*!this.state.hasSenior && <div>
                     <div className="top-time-bottom">
                     <div className="top-time">
                     <Timeout hasEnded={this.state.time} finalDate={this.state.endTime}/>
                     </div>
                     <div className="entered">
                     <div className="show-entered">
                     <div className="show-number"> 剩余名额</div>
                     </div>
                     {this.state.showint ? <span>{this.state.num}</span>:<span>0</span>}
                     </div>
                     </div>
                     </div>*/}

                    <img src="./assetsFund/image/seven/join-content.png" className={this.state.hasSenior ? "intro-img-has-senior" : "intro-img"}/>
                </div> }
                {/*如果已经报名，报名链接时展示*/}
                {this.state.hasPaid && <div>
                    <div className="paid-bg" style={{height:window.innerHeight}} onClick={this.gotoSelectPage}>
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
                                {!this.state.followSubscribe && <div><p className="paid-text">长按扫描下方二维码进入课程公号的“财商训练”，开始学习吧</p>
                                    <div className="page-div">
                                        <img className="page-image" src="./asstesFund/image/tousha-qrcode.jpg"/>
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

                {/*普通用户底部购买按钮*/}
                {/*TODO 测试屏蔽掉邀请好友*/}
                {(!this.state.hasPaid && !this.state.isFreeUser) &&
                <div className="bottom-button">
                    {/*{((this.state.time || !this.state.showint ) && !this.state.hasSenior) ? <span onClick={this.didClickHandler}  className="join-button">还想报名？点我！</span> : <span onClick={this.clickHandler}  className={!this.state.hasSenior ?"join-button":"whole-join-button"}>立即参加（{this.state.buttonPrice}元）</span>}*/}
                    {<span onClick={this.clickHandler}  className={!this.state.hasSenior ?"join-button":"whole-join-button"}>立即参加（{this.state.buttonPrice}元）</span>}
                    {/*<span className="share-button" onClick={this.shareModalHandler}>邀请好友</span>*/}
                    <span className="free-lesson-button" onClick={this.freeLesson}>免费试听</span>
                </div>
                }

                {/*免费用户底部购买按钮*/}
                {(!this.state.hasPaid && this.state.isFreeUser) &&
                <div className="bottom-button">
                    <span onClick={this.checkSubscribe} className="join-button">开始学习吧！</span>
                    <span className="share-button" onClick={this.shareModalHandler}>邀请好友</span>
                </div>
                }

                {/*点击分享时的提示模态引导框*/}
                {this.state.showShareModal && <img src="./asstesFund/image/shareModal.png" onClick={this.hideShareModalHandler} className="share-modal"/>}

                {/*入页面时弹出的分享提示panel*/}
                {this.state.buttonChange && <Modal hideOnTap={false}><SharePanel onClose={this.closeSharePanelHandler} isSubscribed={this.state.isSubscribed}/></Modal>}
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
        Tools.MyRouter('ListenCourse','/listenCourse/1');
    }

});

module.exports = PayPage;
