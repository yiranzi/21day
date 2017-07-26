/**
 * Created by ichangtou on 2017/7/21.
 */
/**
 * Created by yiran1 on 2017/5/5.
 */
const React = require('react');

//根目录
const Tools = require('../../GlobalFunc/Tools');
const convertHtmlToBase64 = require('../../ImageShare');
const Dimensions = require('../../Dimensions');
const Material = require('../../Material');
var User = require('../../User');
const WxConfig = require('../../WxConfig');
const Util = require('../../Util');

const FixedBg = require('../../component/course/FixedBg');

const CourseBegin = React.createClass({
    getInitialState: function() {

        return {
            content: this.props.content,
            type: '',
            userInfo: {},
            senior: {
                courseId: 1,
                name: '长投学员',
                rank: 214,
                headImg: '',
                userId: '',
            },
            friendName: '',
            myName: '',
            isNoteCardDomShow: true,
            isButtonShow: false,
            randomInit: 3.45,
            useTime: [180,25,15,5],
            signUpInfo: {},
        };
    },


    componentWillMount() {
        MyStorage.whenEnterPage('开课证');
        let userId;
        let isMine = this.props.params.mine;
        //下线查看别人的成就卡
        if (!isMine) {
            userId = Util.getUrlPara('ictchannel');
            // Tools.fireRace(User.getUserInfo().userId,"OAUTH_SUCCESS").then(()=>{
            //     Material.postData('下线_查看_getReward');
            //     this.setState({myName: User.getUserInfo().nickName})
            // });
            this.state.senior.userId = userId;
            this.state.senior.name = Util.getUrlPara('name');
            this.setState({type: 'other'});
            //TODO yiran 获得下线名字 这边名字会改成多个.并且成就卡那边也需要这个功能.
            // Material.getShareInfo(userId).always( (name)=>{
            //     this.setState({friendName: name});
            //     // this.setShareConfig();
            // });
        } else {//查看自己的毕业证
            //获取班级群信息
            let courseId = sessionStorage.getItem('courseId');

            Tools.updataCourseData(courseId).then((value)=>{
                // alert('beginPage' + value.qqGroup);
                this.setState({
                    signUpInfo: value,
                });
            });


            userId = User.getUserInfo().userId;
            Tools.fireRace(User.getUserInfo().userId,"OAUTH_SUCCESS").then(()=>{
                this.setState({type: 'mine'});
                this.setState({userInfo: User.getUserInfo()});

                this.state.senior.name = User.getUserInfo().nickName;
                this.state.senior.headImg = User.getUserInfo().headImage;
                this.setState({senior: this.state.senior});
                this.setShareConfig();
                Loading.hideLoading();
            });
        }
    },

    //重置分享链接
    componentWillUnmount () {
        WxConfig.shareConfig();
    },

    componentDidMount () {
        return;
        console.log('didmount');
        const element = document.getElementById('need-draw');
        const width = element.offsetWidth;
        const height = element.offsetHeight;
        Tools.fireRace(User.getUserInfo().userId,"OAUTH_SUCCESS").then(()=>{
            const userId = this.state.type === 'mine' ? User.getUserInfo().userId : Util.getUrlPara('ictchannel');
            if(this.props.params.mine) {
                console.log('wait');
                setTimeout(() => {
                    console.log('finish');
                    convertHtmlToBase64(element, height, width).then((base64)=> {
                        setTimeout(() => {
                            this.setState({
                                shareImgUrl: base64,
                                isNoteCardDomShow: false
                            });
                            Loading.hideLoading()
                        }, 1000)
                    })
                },1000)
            } else {
                Material.getOtherHeadImage(userId).always( (img)=>{
                    // this.state.senior.headImg = img.responseText;
                    this.state.senior.headImg = '';
                    this.setState({senior: this.state.senior}, ()=>{
                        setTimeout(() => {
                            convertHtmlToBase64(element, height, width).then(
                                base64 => {
                                    this.setState({
                                        shareImgUrl: base64,
                                        // isNoteCardDomShow: false
                                    });
                                    Loading.hideLoading()
                                }
                            )
                        },1000)
                    });
                });
            }
        });
        // Material.getNoteCardText(courseId).done((data) => {
        //     this.setState({
        //         noteText: data.message
        //     }, () => {
        //     })
        // })
    },

    /**
     * 设置分享内容1
     * @param fmid
     * @param title
     */
    setShareConfig() {
        let shareTitle = '我正在参加21天训练营',
            link = Util.getShareLink(),
            desc = '一起来参加';
        link = link + '&goPath=' + 'payPage';
        link = link + '&courseId=' + sessionStorage.getItem('courseId');
        WxConfig.shareConfig(shareTitle,desc,link);

        //
        // let senior = this.state.senior;
        // let shareTitle = '我正在参加21天训练营',
        //     link = Util.getShareLink(),
        //     desc = '一起来参加';
        // link = link + '&goPath=' + sessionStorage.getItem('pathNow');
        // link = link + '&courseId=' + sessionStorage.getItem('courseId');
        // link = link + '&name=' + senior.name;
        // WxConfig.shareConfig(shareTitle,desc,link);
    },

    goSignUp(type) {
        if(type === 0) {
            Material.postData('下线_点击鼓励_getGraduated');
            window.dialogAlertComp.show('小伙伴受到鼓励啦','你的鼓励会让TA再接再厉哦。','棒棒哒',()=>{},'',false);
            this.setState({isButtonShow: 'true'});
        } else {
            Material.postData('下线_点击跳转_getGraduated');
            location.hash = "/payPage";
        }
    },

    // style = {fullbg}
    render() {
        return(
            <div className="get-begin-course21">
                {/*<div className="test">123</div>*/}
                <FixedBg/>
                {/*<div className="reward-pic" style={{backgroundImage:"url('./assetsPlus/image/course/noteCard.png')"}}>*/}
                {/*<p className="note-card-project-title">14天基金定投训练营</p>*/}
                {/*<p className="note-card-header">-{this.state.senior.rank}-</p>*/}
                {/*</div>*/}
                {this.renderGraduatedBefore()}
                {/*<img className="get-graduated-after" src={this.state.shareImgUrl}/>*/}
                {/*{this.state.isNoteCardDomShow ? this.renderGraduated() : null}*/}
                <div className="reward-button-graduated">{this.buttonRender()}</div>

            </div>
        )
    },

    renderGraduatedBefore() {
        return(
            <div id = 'need-draw' className="get-graduated-before" style = {{backgroundImage: 'url("./assetsPlus/image/course21/graduated.png")'}}>
                <img className="head" src={this.state.senior.headImg}/>
                {/*<img className="head" src="./assetsPlus/image/course21/share_payPage.png"/>*/}
                <div className="title">
                    <p>
                        恭喜<span className="name">{this.state.senior.name}</span>同学<br/>
                        加入21天训练营，<br/>
                        祝你在接下来的日子里<br/>
                        成功迈出理财第一步<br/>
                    </p>
                </div>
            </div>
        )
    },

    calcRandom(index){
        if(index === 0) {
            return Math.floor(Number(this.state.randomInit));
        }
        if(index===5){
            return (this.state.senior.rank % 10 * 1.23 +76).toFixed(1);
        }
        let random = 0;
        // if(index!==3){
        //     random = Math.random().toFixed(2);
        // }
        // let answer = ((this.state.randomInit/this.state.useTime[index]) + random).toFixed(2);
        let answer = (this.state.randomInit/this.state.useTime[index]).toFixed(2);
        //总学习时间 比上 各个平均时间
        return answer;
    },


    renderGraduated() {
        return(
            <div>
                <div id = 'need-draw' className="get-graduated" style = {{backgroundImage: 'url("./assetsPlus/image/course21/graduated.png")'}}>
                    <img className="head" src={this.state.senior.headImg}/>
                    {/*<img className="head" src="./assetsPlus/image/course21/share_payPage.png"/>*/}
                    <div className="title">
                        <p>
                            恭喜<span className="name">{this.state.senior.name}</span>同学<br/>
                            加入21天训练营，<br/>
                            祝你在接下来的日子里<br/>
                            成功迈出理财第一步<br/>
                        </p>
                    </div>
                </div>
            </div>
        )
    },

    goCommand() {
        //WA 1
        window.dialogAlertComp.show('你是最棒的','真是厉害啊，好好庆祝一下自己的成就，晒晒自己的战绩吧！你会获得来自大家的赞赏和鼓励哦！','好哒师兄',()=>{},()=>{},false);
    },

    buttonRender() {
        let arr = [];
        let imgs = ['./assetsPlus/image/course21/wx_payPage.png','./assetsPlus/image/course21/share_payPage.png','./assetsPlus/image/course21/qqGroup_payPage.png'];
        let fonts = ['每日作业','分享','找老师'];
        if(this.state.type ==='mine') {
            for(let i =0; i<3; i++) {
                arr.push(<div className="button" onClick = {this.showQQInfo.bind(this,i)}>
                    <img src={imgs[i]}/>
                    <span>{fonts[i]}</span>
                </div>)
            }
            // arr.push((<div key={1} className="reward-button-graduated" onClick = {this.showQQInfo}>
            //     <img className="button-img" src={'./assetsPlus/image/course/btnSignin.png'}/>
            //     <p className="button-p">qq群</p>
            // </div>));
            return arr;
        }
    },

    showQQInfo(type) {
        switch (type) {
            case 0:
                window.dialogAlertComp.show('报名成功','赶紧关注公众号"长投"，每天陪你一起学习哟~','好勒，知道了！',this.gotoBeginReward,()=>{},false);
                break;
            case 1:
                window.dialogAlertComp.show('分享','快去分享给你的小伙伴吧。学姐说大家一起学习更能坚持下去哦！','知道啦',()=>{},'',false);
                break;
            case 2:
                window.dialogAlertComp.show('加入QQ群（学习群务必加入）',`群号${this.state.signUpInfo.qqGroup},暗号${this.state.signUpInfo.secret}`,'点击加入',()=>
                {location.href = this.state.signUpInfo.qqGroupUrl;},'我加过了',true);
                break;
            default:
                break
        }

    },

    renderFont(text) {
        return(
            <div className="text-stroke">
                <p className="text-stroke-out">{text}</p>
                <p className="text-stroke-inner">{text}</p>
            </div>)
    },


});

module.exports = CourseBegin;