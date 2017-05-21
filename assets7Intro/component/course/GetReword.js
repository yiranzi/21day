/**
 * Created by yiran1 on 2017/5/5.
 */
const $ = window.$ = require('jquery');
const React = require('react');
const Dimensions = require('../../Dimensions');
const Material = require('../../Material');
var User = require('../../User');
const WxConfig = require('../../WxConfig');
const Util = require('../../Util');

const GetReward = React.createClass({
    getInitialState: function() {

        return {
            content: this.props.content,
            lockPic: [
                "./assets7Intro/image/course/card_1.png",
                "./assets7Intro/image/course/card_2.png",
                "./assets7Intro/image/course/card_3.png",
                "./assets7Intro/image/course/card_4.png",
                "./assets7Intro/image/course/card_5.png",
                "./assets7Intro/image/course/card_6.png",
                "./assets7Intro/image/course/card_7.png",
            ],
            title: [
                '第一课',
                '第二课',
                '第三课',
                '第四课',
                '第五课',
                '第六课',
                '第七课',
            ],
            shareTitle: [
                '储蓄',
                '货币基金',
                '保险',
                '债券',
                '指数基金',
                '股票',
                '资产配置',
            ],
            type: '',
            userInfo: {},
            senior: {
                courseId: 1,
                name: '长投学员',
                rank: 214,
                headImg: '',
            },
        };
    },

    componentWillMount() {
        console.log('get reward');
        let userId;
        //判定是否有分享成就卡
        this.state.senior.courseId = Util.getUrlPara('courseId');
        if (this.state.senior.courseId) {
            userId = Util.getUrlPara('ictchannel');
            Material.getOtherHeadImage(userId).always( (img)=>{
                this.state.senior.headImg = img.responseText;
                this.setState({senior: this.state.senior});
            })
            this.state.senior.name = Util.getUrlPara('name');
            this.state.senior.rank = Util.getUrlPara('rank');
            this.setState({type: 'other'});
        } else {
            //如果毕业证
            let rank = this.props.params.rank;
            if( rank !== '-2' ){
                console.log('毕业证!!!');
                userId = User.getUserInfo().userId;
                this.setState({type: 'mine'});
                this.setState({userInfo: User.getUserInfo()});

                this.state.senior.name = User.getUserInfo().nickName;
                this.state.senior.headImg = User.getUserInfo().headImage;
                this.state.senior.rank = rank;
                this.state.senior.courseId = '8';
                this.setState({senior: this.state.senior});
                this.setShareConfig();
            } else {
                //获得课程的Id
                let courseId = this.props.params.courseId;
                userId = User.getUserInfo().userId;
                this.setState({type: 'mine'});
                this.setState({userInfo: User.getUserInfo()});
                //获得自己的课程排名
                Material.courseFinishRank(courseId,userId).done((data) =>{
                    this.state.senior.name = User.getUserInfo().nickName;
                    this.state.senior.headImg = User.getUserInfo().headImage;
                    this.state.senior.rank = data;
                    this.state.senior.courseId = this.props.params.courseId;
                    this.setState({senior: this.state.senior});
                    this.setShareConfig();
                    //TODO 将参数传入分享url中.
                })
            }

        }
    },

    componentWillUnmount () {
        //TODO 冲掉特殊的分享连接
        console.log('didUnMount')
        let senior = this.state.senior;
        let shareTitle = '快和我一起参加财商训练营吧',
            link = Util.getShareLink(),
            desc = '点击链接报名只需6元哦,按时毕业还有奖学金!';
        WxConfig.shareConfig(shareTitle,desc,link);
    },

    /**
     * 设置分享内容
     * @param fmid
     * @param title
     */
    setShareConfig() {
        //TODO 设置好进入参数
        let senior = this.state.senior;
        if (senior.courseId === '8') {
            let shareTitle = '7天财商训练营毕业证到手!满满的成就感啊!一切都值了!',
                link = Util.getShareLink(),
                desc = '快为我鼓掌吧!';
            link = link + '&courseId=' + senior.courseId;
            link = link + '&name=' + senior.name;
            link = link + '&rank=' + senior.rank;
            link = link + '&headimage=' + senior.headImg;
            WxConfig.shareConfig(shareTitle,desc,link);
        } else {
            let shareTitle = '我是第'+ this.state.senior.rank+'名完成'+this.state.shareTitle[ this.state.senior.courseId - 1] + '课的人，快来看看我的成就卡吧！',
                link = Util.getShareLink(),
                desc = '快比比谁的财商更高吧?';
            link = link + '&courseId=' + senior.courseId;
            link = link + '&name=' + senior.name;
            link = link + '&rank=' + senior.rank;
            WxConfig.shareConfig(shareTitle,desc,link);
        }

    },


    handleClick() {
        location.hash = "/select";
    },

    // + '&code=' + Util.getUrlPara('code')
    goSignUp() {
        Util.postCnzzData("成就页面报名");
        let url = Util.getHtmlUrl() + '?ictchannel=' + Util.getUrlPara('ictchannel');
        location.href = url;
    },
    // style = {fullbg}
    render() {
        return(
            <div className="get-reward" style = {{backgroundImage: 'url("./assets7Intro/image/course/bg_1.png")',width: Dimensions.getWindowWidth(), height: Dimensions.getWindowHeight()}}>
                {this.state.senior.courseId === '8' ? this.renderGraduated(): this.renderFinishCard()}
                <img className="reward-light" onClick={this.handleClick} src={'./assets7Intro/image/course/bglight.png'}/>
            </div>
        )
    },

    renderGraduated() {
        return(
            <div>
               <div className="get-graduated" style = {{backgroundImage: 'url("./assets7Intro/image/course/graduated.png")'}}>
                   <img className="head" src={this.state.senior.headImg}/>
                   <div className="title">
                       <p>{this.state.senior.name}</p>
                       <p>是第{this.state.senior.rank}名</p>
                       <p>完成财商训练营的学员</p>
                   </div>
               </div>
                {this.buttonRender()}
            </div>
        )
    },

    renderFinishCard() {
        return(
            <div>
                {this.renderTitle()}
                {/*<img className="reward-light" onClick={this.handleClick} src={'./assets7Intro/image/course/bglight.png'}/>*/}
                <img className="reward-pic" onClick={this.handleClick} src={this.state.lockPic[this.state.senior.courseId - 1] }/>
                {this.buttonRender()}
            </div>
        )
    },

    renderTitle() {
        if(this.state.type ==='mine') {
            return (<div className="card-title">
                {this.renderFont('恭喜你成为')}
                {this.renderFont('第' + this.state.senior.rank+'名')}
                {this.renderFont('完成该课程的学员')}
            </div>)
        } else {
            return (<div className="card-title">
                {this.renderFont(this.state.senior.name+'是')}
                {this.renderFont('第' + this.state.senior.rank+'名')}
                {this.renderFont('完成'+this.state.shareTitle[this.state.senior.courseId - 1] + '课的学员')}
            </div>)
        }
    },

    goCommand() {
        Util.postCnzzData("成就页面点击分享");
        window.dialogAlertComp.show('快快分享你的进步吧','点击右上角三个点点，分享到你的朋友圈吧！','好哒师兄',()=>{},()=>{},false);
    },

    buttonRender() {
        if(this.state.type ==='mine') {
            return <div className="reward-button" onClick = {this.goCommand}>
                <img src={'./assets7Intro/image/course/btnSignin.png'}/>
                <p>我要分享</p>
            </div>
        } else {
            return <div className="reward-button" onClick = {this.goSignUp}>
                    <img src={'./assets7Intro/image/course/btnSignin.png'}/>
                    <p>我也要报名</p>
                </div>
        }
    },

    renderFont(text) {
        return(
            <div className="text-stroke">
                <p className="text-stroke-out">{text}</p>
                <p className="text-stroke-inner">{text}</p>
            </div>)
    }
});

module.exports = GetReward;