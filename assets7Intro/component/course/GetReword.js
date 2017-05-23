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
                userId: '',
            },
            friendName: '',
        };
    },

    componentWillMount() {
        console.log('get reward');
        let userId;
        //判定是否有分享成就卡
        this.state.senior.courseId = Util.getUrlPara('courseId');
        if (this.state.senior.courseId) {
            userId = Util.getUrlPara('ictchannel');
            this.state.senior.userId = userId;
            Material.getOtherHeadImage(userId).always( (img)=>{
                this.state.senior.headImg = img.responseText;
                this.setState({senior: this.state.senior});
            });
            this.state.senior.name = Util.getUrlPara('name');
            this.state.senior.rank = Util.getUrlPara('rank');
            this.setState({type: 'other'});
            //TODO 分享的时候如果为8发送请求.获得领取信息
            if (this.state.senior.courseId === '8') {
                Material.getShareInfo(userId).always( (name)=>{
                    this.setState({friendName: name});
                });
            }
        } else {
            let rank = this.props.params.rank;
            //rank默认是-2 如果是毕业证就不是-2.这里应该用courseId === 8 判定
            if( rank !== '-2' ){
                //如果毕业证
                //TODO 获得领取信息
                userId = User.getUserInfo().userId;
                Material.getShareInfo(userId).always( (name)=>{
                    this.setState({friendName: name});
                });
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
                })
            }

        }
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
    setShareConfig() {
        let senior = this.state.senior;
        if (senior.courseId === '8') {
            if(this.state.friendName === '') {
                let shareTitle = '7天财商训练营，赠给财商最高的你',
                    link = Util.getShareLink(),
                    desc = '财商最高的人就是你';
                link = link + '&courseId=' + senior.courseId;
                link = link + '&name=' + senior.name;
                link = link + '&rank=' + senior.rank;
                WxConfig.shareConfig(shareTitle,desc,link);
            } else {
                let shareTitle = '7天财商训练营毕业证到手!满满的成就感啊!一切都值了!',
                    link = Util.getShareLink(),
                    desc = '快看看我的毕业证!';
                link = link + '&courseId=' + senior.courseId;
                link = link + '&name=' + senior.name;
                link = link + '&rank=' + senior.rank;
                WxConfig.shareConfig(shareTitle,desc,link);
            }
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
    goSignUp(isFree) {
        Util.postCnzzData("成就页面报名");
        if(isFree){
            //毕业证
            //TODO 发送报名请求
            let upId = this.state.senior.userId;
            let myId = User.getUserInfo().userId;
            let myName = User.getUserInfo().nickName;
            // window.dialogAlertComp.show(upId,myId,myName,()=>{},()=>{},false);
            Material.FreeShareSignUp(upId,myName).always( (result)=>{
                if (result.whether) {
                    Util.postCnzzData("毕业-成功领取");
                    window.dialogAlertComp.show('已经成功领取','你已经领取啦','去课堂看看',()=>{
                        location.hash = "/paypage/1"
                    },'待会再看',true);

                } else {
                    Util.postCnzzData("毕业-也被领取跳转报名");
                    location.hash = "/paypage";
                }
            });
        } else {
            let url = Util.getHtmlUrl() + '?ictchannel=' + Util.getUrlPara('ictchannel');
            location.href = url;
        }

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
                       <p className="name">{this.state.senior.name}</p>
                       <p className="rank">第{this.state.senior.rank}名</p>
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
        if(this.state.senior.courseId === '8'){
            if(this.state.friendName.message === '') {
                Util.postCnzzData("毕业-赠送朋友提示");
                window.dialogAlertComp.show('赠送课程给你的朋友','你财商水平很高啦，挑选一个财商最高的小伙伴，赠送给他这门课吧！点击右上角三个点点，分享给好友吧。','好哒师兄',()=>{},()=>{},false);
            } else {
                Util.postCnzzData("毕业-送给更多人提示");
                window.dialogAlertComp.show('告诉更多的朋友吧','你已经顺利毕业啦，鼓励更多的小伙伴被你的正能量带动，一同积极学习吧！点击右上角三个点点，分享到你的朋友圈吧！','好哒师兄',()=>{},()=>{},false);
            }
        } else {
            window.dialogAlertComp.show('快快分享你的进步吧','点击右上角三个点点，分享到你的朋友圈吧！','好哒师兄',()=>{},()=>{},false);
        }

        //毕业证
        //TODO yiran 送给小伙伴的提示文案
    },

    buttonRender() {
        let arr = [];
        if(this.state.type ==='mine') {
            //毕业证
            //TODO yiran 送给小伙伴
            //接口返回谁领取了
            //点击之后 发送分享链接 里面有上线信息.照旧
            if(this.state.senior.courseId === '8')
            {
                //如果还没有朋友领取
                if(this.state.friendName.message === '') {
                    arr.push((<div key={1} className="graduated-tip">
                        <p>恭喜顺利毕业！</p>
                        <p>现可免费赠送此课程一份！</p>
                        <p>快去赠给你财商最高的那位朋友吧</p>
                        {/*<p>由于你的优异成绩，你赢的了一次推荐7天给他人学习的机会！</p>*/}
                        {/*<p>如果你觉得有所收获，就大方的送给你身边</p>*/}
                        {/*<p>最有潜力，财商最高的朋友吧！</p>*/}
                        {/*<p>机会只有一次哦，快去送给他！</p>*/}
                    </div>));
                    arr.push(<div key={2} className="reward-button-graduated" onClick = {this.goCommand}>
                        <img className="button-img" src={'./assets7Intro/image/course/btnSignin.png'}/>
                        <p className="button-p">送给Ta</p>
                    </div>)
                } else {
                    arr.push((<div key={1} className="graduated-tip">
                        <p>你的课程被{this.state.friendName.message}抢先领走了！</p>
                        <p>你还可以推荐更多的人来学习！</p>
                    </div>));
                    arr.push(<div key={2} className="reward-button-graduated" onClick = {this.goCommand}>
                        <img className="button-img" src={'./assets7Intro/image/course/btnSignin.png'}/>
                        <p className="button-p">送给更多的人</p>
                    </div>)
                }
                return arr;
            } else {
                return <div className="reward-button" onClick = {this.goCommand}>
                    <img className="button-img" src={'./assets7Intro/image/course/btnSignin.png'}/>
                    <p className="button-p">我要分享</p>
                </div>
            }
        } else {
            //毕业证
            //TODO yiran 接收小伙伴的礼物
            //接口返回谁领取了
            if(this.state.senior.courseId === '8')
            {
                //如果还没有朋友领取
                if(this.state.friendName.message === '') {
                    arr.push((<div key={1} className="graduated-tip">
                        <p>{this.state.senior.name} 认为你的财商突破天际</p>
                        <p>赠送了一个训练营名额给你。</p>
                    </div>));
                    arr.push((<div key={2} className="reward-button-graduated" onClick = {this.goSignUp.bind(this,true)}>
                        <img className="button-img" src={'./assets7Intro/image/course/btnSignin.png'}/>
                        <p className="button-p">立即参加</p>
                    </div>));
                } else {
                    arr.push((<div key={1} className="graduated-tip">
                        <p>来晚一步，名额已被 {this.state.friendName.message} 领走了！</p>
                    </div>));
                    arr.push((<div key={2} className="reward-button-graduated" onClick = {this.goSignUp.bind(this,true)}>
                        <img className="button-img" src={'./assets7Intro/image/course/btnSignin.png'}/>
                        <p className="button-p">3元抢课</p>
                    </div>));
                }
                return arr;
            } else {
                return <div className="reward-button" onClick = {this.goSignUp}>
                    <img className="button-img" src={'./assets7Intro/image/course/btnSignin.png'}/>
                    <p className="button-p">我也要报名</p>
                </div>
            }


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