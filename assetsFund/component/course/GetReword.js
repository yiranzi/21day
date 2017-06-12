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
var OnFire =require('onfire.js');

const GetReward = React.createClass({
    getInitialState: function() {

        return {
            content: this.props.content,
            lockPic: [
                "./assetsFund/image/course/card_1.png",
                "./assetsFund/image/course/card_2.png",
                "./assetsFund/image/course/card_3.png",
                "./assetsFund/image/course/card_4.png",
                "./assetsFund/image/course/card_5.png",
                "./assetsFund/image/course/card_6.png",
                "./assetsFund/image/course/card_7.png",
            ],
            lockPicHQ: [
                "./assetsFund/image/course/card_1_b.png",
                "./assetsFund/image/course/card_2_b.png",
                "./assetsFund/image/course/card_3_b.png",
                "./assetsFund/image/course/card_4_b.png",
                "./assetsFund/image/course/card_5_b.png",
                "./assetsFund/image/course/card_6_b.png",
                "./assetsFund/image/course/card_7_b.png",
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
                userId: '',
            },
            friendInfo: {
                headImg: '',
                name: '',
            },
            myName: '',
            freeChance: false,//是否可以分享
            isPay: false,
            freeRewardLink: false,//是否是试听链接
        };
    },

    componentWillMount() {
        let userId;
        //判定是否有分享成就卡
        this.state.senior.courseId = Util.getUrlPara('courseId');
        let isMine = this.props.params.mine;
        //下线查看别人的成就卡
        if (this.state.senior.courseId && !isMine) {
            userId = Util.getUrlPara('ictchannel');
            if (User.getUserInfo().userId) {
                Material.postData('下线_查看_getReward');
                this.setState({myName: User.getUserInfo().nickName})
            } else {
                OnFire.on('OAUTH_SUCCESS',()=>{
                    Material.postData('下线_查看_getReward');
                    this.setState({myName: User.getUserInfo().nickName})
                });
            }
            this.state.senior.userId = userId;
            Material.getOtherHeadImage(userId).always( (img)=>{
                this.state.senior.headImg = img.responseText;
                this.setState({senior: this.state.senior});
            });
            this.state.senior.name = Util.getUrlPara('name');
            this.state.senior.rank = Util.getUrlPara('rank');
            this.setState({type: 'other'});
            //todo 如果是试听分享链接
            if (Util.getUrlPara('freeLesson')) {
                //todo sta 下线_进入_GetReword
                this.setState({freeRewardLink: true});
                //todo 获得所有绑定的名字,并保存这些名字
                this.setShareInfo();
            }
        } else {//查看自己的
            userId = User.getUserInfo().userId;
            Material.postData('上线_进入_getReward');
            let courseId = this.props.params.courseId;
            this.setState({type: 'mine'});
            this.setState({userInfo: User.getUserInfo()});
            //获得自己的课程排名
            Material.courseFinishRank(courseId,userId).done((data) =>{
                this.state.senior.name = User.getUserInfo().nickName;
                this.state.senior.headImg = User.getUserInfo().headImage;
                this.state.senior.rank = data;
                this.state.senior.courseId = this.props.params.courseId;
                this.setState({senior: this.state.senior});

                //1是否是付费用户?
                Material.getJudgeFromServer().done((result)=>{
                    //付费用户分享
                    if(result){
                        this.setState({
                            isPay: true,
                        });
                        //2是否是当天完成?
                        Material.getUpstreamShare(this.state.senior.courseId).done( (result)=>{
                            if (result) {
                                //设置分享权限
                                this.setState({
                                    freeChance: true,
                                });
                                this.setShareInfo();
                                //设置分享内容
                                this.setShareConfig('freeChance');
                            }
                        });
                    }
                    //免费用户分享分享的
                    else
                    {
                        this.setShareConfig('share');
                    }
                });
            })
        }
        Loading.hideLoading();
    },

    setShareInfo() {
        //获取当前的分享情况
        Material.getShareInfo(userId,this.state.senior.courseId).always( (info)=>{
            //todo 获得下线的头像和名字
            this.state.friendInfo.name = info;
            this.setState({friendInfo: this.state.friendInfo});
        });
    },

    componentWillUnmount () {
        console.log('didUnMount')
        let senior = this.state.senior;
        let shareTitle = '快和我一起参加财商训练营吧',
            link = Util.getShareLink(),
            desc = '点击链接报名只需3元哦,按时毕业还有奖学金!';
        WxConfig.shareConfig(shareTitle,desc,link);
    },

    /**
     * 设置分享内容
     * @param fmid
     * @param title
     */
    setShareConfig(type) {
        let senior = this.state.senior;
        let shareTitle;
        let link = Util.getShareLink();
        let desc;
        switch (type) {
            //分享当日免费课(高级分享)
            case 'freeChance':
                shareTitle = '我是第'+ this.state.senior.rank+'名完成'+this.state.shareTitle[ this.state.senior.courseId - 1] + '课的人，dialog按时完成课程的奖励';
                desc = 'dialog这是赠送的免费课';
                link = link + '&goPath=' + '/getReward/' + senior.courseId;
                link = link + '&courseId=' + senior.courseId;
                link = link + '&name=' + senior.name;
                link = link + '&rank=' + senior.rank;
                link = link + '&freeLesson=true';
                WxConfig.shareConfig(shareTitle,desc,link);
                break;
            //普通分享
            case 'share':
                senior = this.state.senior;
                shareTitle = '我是第'+ this.state.senior.rank+'名完成'+this.state.shareTitle[ this.state.senior.courseId - 1] + '课的人，快来看看我的成就卡吧！';
                desc = '快比比谁的财商更高吧?';
                link = link + '&goPath=' + '/getReward/' + senior.courseId;
                link = link + '&courseId=' + senior.courseId;
                link = link + '&name=' + senior.name;
                link = link + '&rank=' + senior.rank;
                WxConfig.shareConfig(shareTitle,desc,link);
                break;
            default:
                console.log('error')
        }
        console.log('share is' + link);
    },

    handleClick() {
        location.hash = "/select";
    },

    //上线点击
    goCommand() {
        Util.postCnzzData("成就页面点击分享");
        Material.postData('上线_点击_getReward');
        window.dialogAlertComp.show('快快分享你的进步吧','点击右上角三个点点，分享到你的朋友圈吧！','好哒师兄',()=>{},()=>{},false);
    },

    //下线点击
    goSignUp() {
        //todo 数据统计 下线点击
        Util.postCnzzData("成就页面报名");
        if (User.getUserInfo().userId) {
            Material.postData('下线_点击_getReward');
        } else {
            OnFire.on('OAUTH_SUCCESS',()=>{
                Material.postData('下线_点击_getReward');
            });
        }

        //如果是高级链接
        if (this.state.freeRewardLink) {
            //如果还有名额
            if (this.state.friendInfo.length <= 3) {
                //如果不是付费用户.就能领取.上线id,课程id
                if(!this.state.isPay){
                    if (User.getUserInfo().userId) {
                        Material.GetFreeShareLesson(this.state.senior.userId,this.state.senior.courseId);
                    } else {
                        OnFire.on('OAUTH_SUCCESS',()=>{
                            Material.GetFreeShareLesson(this.state.senior.userId,this.state.senior.courseId);
                        });
                    }
                }
                location.hash = '/course/' + this.state.senior.courseId + '/free';
            } else {
                location.hash = '/select';
            }
        }
        //如果是普通链接
        else
        {
            location.hash = '/select';
        }
    },

    render() {
        return(
            <div className="get-reward" style = {{backgroundImage: 'url("./assetsFund/image/course/bg_1.png")',width: Dimensions.getWindowWidth(), height: Dimensions.getWindowHeight()}}>
                <p>是否可以分享{this.state.freeChance ? 'true' : 'false'}</p>
                <p>是否是付费用户{this.state.isPay ? 'true' : 'false'}</p>
                <p>是否是免费链接{this.state.freeRewardLink ? 'true' : 'false'}</p>
                {/*<div>进入时,这门课程的状态时{this.props.location.query.name}</div>*/}
                {this.renderFinishCard()}
                <img className="reward-light" onClick={this.handleClick} src={this.state.type ==='mine' ? './assetsFund/image/course/bglight_b.png' : './assetsFund/image/course/bglight.png'}/>
            </div>
        )
    },

    renderFinishCard() {
        return(
            <div>
                {this.renderTitle()}
                {/*<img className="reward-light" onClick={this.handleClick} src={'./assetsFund/image/course/bglight.png'}/>*/}
                <img className="reward-pic" onClick={this.handleClick} src={this.state.type ==='mine' ? this.state.lockPicHQ[this.state.senior.courseId - 1] : this.state.lockPic[this.state.senior.courseId - 1] }/>
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
                {this.renderFont('完成'+this.state.shareTitle[this.state.senior.courseId - 1] + '课的学员哦哦')}
            </div>)
        }
    },



    buttonRender() {
        let arr = [];
        if(this.state.type ==='mine') {
            return <div className="reward-button" onClick = {this.goCommand}>
                <img className="button-img" src={'./assetsFund/image/course/btnSignin.png'}/>
                <p className="button-p">我要分享</p>
            </div>
        } else {
            return <div className="reward-button" onClick = {this.goSignUp}>
                <img className="button-img" src={'./assetsFund/image/course/btnSignin.png'}/>
                <p className="button-p">我也去看看</p>
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