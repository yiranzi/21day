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
const convertHtmlToBase64 = require('../../ImageShare')
const courseInfo = require('../../CourseInfo')
const GetReward = React.createClass({
    getInitialState: function() {

        return {
            content: this.props.content,
            type: '',
            userInfo: {},
            senior: {
                courseId: 10,
                name: '长投学员',
                rank: 0,
                headImg: '',
                userId: '',
            },
            friendInfo: [],
            friendName: '',
            myName: '',
            shareImgUrl: '',
            isNoteCardDomShow: true,
            freeChance: false,//是否可以分享
            isPay: false,
            freeRewardLink: false,//是否是试听链接
            noteText: ''
        };
    },

    componentWillMount() {
        Loading.showLoading('正在生成笔记卡');
        document.body.scrollTop = document.documentElement.scrollTop = 0
        let userId;
        //判定是否有分享成就卡
        this.state.senior.courseId = Util.getUrlPara('courseId');
        let isMine = this.props.params.mine;
        //下线查看别人的成就卡
        if (this.state.senior.courseId && !isMine) {
            Material.getNoteCardText(this.state.senior.courseId).done((data) => {
                this.setState({
                    noteText: data.message
                })
            })
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
            this.state.senior.name = Util.getUrlPara('name');
            this.state.senior.rank = Util.getUrlPara('rank');
            this.setState({type: 'other'});
            //todo 如果是试听分享链接
            if (Util.getUrlPara('freeLesson')) {
                //todo sta 下线_进入_GetReword
                this.setState({freeRewardLink: true}, () => {
                    this.setShareConfig('freeChance');
                });
                //todo 获得所有绑定的名字,并保存这些名字
                this.setShareInfo(userId);
            } else {
                this.setShareConfig('share');
            }
        } else {//查看自己的
            userId = User.getUserInfo().userId;
            Material.postData('上线_进入_getReward');
            let courseId = this.props.params.courseId;
            Material.getNoteCardText(courseId).done((data) => {
                this.setState({
                    noteText: data.message
                })
            })
            this.setState({type: 'mine', userInfo: User.getUserInfo()});
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
                                    freeChance: true
                                });
                                this.setShareInfo(userId);
                                //设置分享内容
                                this.setShareConfig('freeChance');
                            }
                            // Loading.hideLoading();
                        });
                    }
                    //免费用户分享分享的
                    else
                    {
                        this.setShareConfig('share');
                        // Loading.hideLoading();

                    }
                });
            })
        }
    },

    setShareInfo(userId) {
        //获取当前的分享情况
        Material.getShareInfo(userId || this.state.senior.userId,this.state.senior.courseId).always( (info)=>{
            //todo 获得下线的头像和名字
            this.setState({friendInfo: info});
        });
    },
    componentDidMount () {
        // const rewardQrcode = document.getElementById('reward-qrcode')
        // new QRcode(document.getElementById('reward-qrcode'), {
        //     text: window.location.href,
        //     width: rewardQrcode.offsetWidth,
        //     height: rewardQrcode.offsetHeight,
        //     colorDark: '#000',
        //     colorLight: '#fff',
        //     correctLevel: QRcode.CorrectLevel.H
        // })
        const element = document.getElementsByClassName('reward-pic')[0]
        const width = element.offsetWidth
        const height = element.offsetHeight
        const courseId = Util.getUrlPara('courseId') || this.props.params.courseId
        const userId = Util.getUrlPara('ictchannel') || this.props.params.userId || User.getUserInfo().userId
        Material.getNoteCardText(courseId).done((data) => {
            this.setState({
                noteText: data.message
            }, () => {
                Material.courseFinishRank(courseId,userId).done(data => {
                    this.state.senior.rank = data
                    convertHtmlToBase64(element, height, width).then(
                        base64 => {
                            this.setState({
                                shareImgUrl: base64,
                                isNoteCardDomShow: false
                            })
                            Loading.hideLoading()
                        }
                    )
                })

            })
        })

    },
    componentWillUnmount () {
        let senior = this.state.senior;
        let shareTitle = '14天基金定投训练营，手把手带你从0学习基金投资',
            link = Util.getShareLink(),
            desc = '';
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
        let course = courseInfo.find(
            course => {
                return course.id === parseInt(senior.courseId)
            }
        )
        let desc;
        switch (type) {
            //分享当日免费课(高级分享)
            case 'freeChance':
                shareTitle = '我是第'+ this.state.senior.rank+'名准时完成基金定投训练营('+ course.dayTitle + ')的人，3个免费听课名额，请你来听';
                desc = '';
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
                shareTitle = '我是第'+ this.state.senior.rank+'名完成基金定投训练营('+ course.dayTitle + ')的人';
                desc = '';
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

                location.hash = '/course/10';
            }
        } else {      //如果是普通链接
            location.hash = '/course/10';
        }
    },

    render() {
        return(
            <div className="get-reward" style = {{backgroundImage: 'url("./assetsFund/image/course/bg_share.jpg")',width: Dimensions.getWindowWidth(),minHeight: Dimensions.getWindowHeight()}}>
                {this.renderFinishCard()}
            </div>
        )
    },

    renderFinishCard() {
        const isNoteCardDomShow = this.state.isNoteCardDomShow
        const freeRewardLink = this.state.freeRewardLink
        const freeChance = this.state.freeChance
        const cardStyleNormal = {
            marginTop:'3.7rem'
        }
        const cardStyleSenior = {
            marginTop:'0'
        }
        return(
            <div>
                <div className="note-card-title" style={cardStyleSenior}>恭喜，你是第{this.state.senior.rank}位按时完成的学员</div>
                {/*<img className="reward-light" onClick={this.handleClick} src={'./assetsFund/image/course/bglight.png'}/>*/}
                {/*<img className="reward-pic" onClick={this.handleClick} src={this.state.type ==='mine' ? this.state.lockPicHQ[this.state.senior.courseId - 1] : this.state.lockPic[this.state.senior.courseId - 1] }/>*/}
                <img className="reward-pic-img" src={this.state.shareImgUrl}/>
                {isNoteCardDomShow && this.renderShareCard()}
                {(freeRewardLink || freeChance) && <p className="note-card-tips">
                    <img src="./assetsFund/image/course/indDown.png" alt="" />
                    <p>
                        你可以分享这个页面<br/>邀请三位朋友免费听今天的课程
                    </p>
                    <img src="./assetsFund/image/course/indDown.png" alt="" />
                </p>}
                {(freeRewardLink || freeChance) && this.shareUserList()}
                {this.buttonRender()}
            </div>
        )
    },
    renderShareCard () {
        const text = this.state.noteText
        const textArr = text ? text.split('#') : ''
        const content = textArr ? textArr[1].replace(/\r\n/g, '<br>') : ''
        let course = courseInfo.find(
            course => {
                return course.id === parseInt(Util.getUrlPara('courseId') || this.props.params.courseId)
            }
        )
        console.log(course)
        return (
            <div className="reward-pic" style={{backgroundImage:"url('./assetsFund/image/course/noteCard.png')"}}>
                <p className="note-card-project-title">14天基金定投训练营</p>
                <p className="note-card-header">-{course.cardTitle}-</p>
                <p className="note-card-content-title">{textArr && textArr[0]}</p>
                <div className="note-card-text" dangerouslySetInnerHTML={{__html:content || ''}}></div>
                <div className="share-qrcode"><img src="./assetsFund/image/course/shareqrcode.png" alt=""/></div>
            </div>
        )
    },


    buttonRender() {
        const freeRewardLink = this.state.freeRewardLink
        const isPay = this.state.isPay
        const type = this.state.type
        const friendInfo = this.state.friendInfo
        const isGetLesson = freeRewardLink && !isPay && type === 'other' && friendInfo.length < 3
        const isGetFree = freeRewardLink && !isPay && type === 'other' && friendInfo.length >= 3
        return (
            <div><div className="reward-share-button" onClick={type === 'mine' ? this.goCommand : this.goSignUp}>
                {type === 'mine' ? '我要分享' : isGetLesson ? '获取免费试听' : '去听听免费课吧'}
        </div></div>)
    },

    shareUserList() {
        return (
            <div className="share-user-list">
                <div className="share-user-title">已经获得免费听课资格的好友</div>
                {this.shareUser()}
            </div>
        )
    },
    shareUser() {
        const userArr = [1, 2, 3];
        const friendInfo = this.state.friendInfo
        const userList = userArr.map(user =>
            <div className="share-user-logo" key={user}>
                <div className={!friendInfo[user-1] ? 'share-user-headimage-noborder' : 'share-user-headimage'}><div>{friendInfo[user-1] && <img src={friendInfo[user-1].headImg} />}</div></div>
                <div className="share-user-name">{friendInfo[user-1] && friendInfo[user-1].name || '用户'+user}</div>
            </div>
        )
        return userList
    }

});

module.exports = GetReward;