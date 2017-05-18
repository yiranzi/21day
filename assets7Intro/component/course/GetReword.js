/**
 * Created by yiran1 on 2017/5/5.
 */
const $ = window.$ = require('jquery');
const React = require('react');
const Dimensions = require('../../Dimensions');
const Material = require('../../Material');
var User = require('../../User');

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
            rank: 214,
        };
    },

    componentWillMount() {
        //获得课程的Id
        let courseId = this.props.params.courseId;
        //获得分享链接的Id
        let seniorId = Util.getUrlPara('ictchannel');
        let userId = User.getUserInfo().userId;
        console.log('courseId',courseId);
        console.log('seniorId',courseId);

        //获得自己的课程排名
        Material.courseFinishRank(courseId,userId).done((data) =>{
            this.state.rank = data;
            this.setState({rank: data});
        })
    },


//<p className="reward-recommand" onClick={this.goCommand()}>1231211231</p>
    handleClick() {
        location.hash = "/select";
    },
    // style = {fullbg}
    render() {
        return(
            <div className="get-reward" style = {{backgroundImage: 'url("./assets7Intro/image/course/bg_1.png")',width: Dimensions.getWindowWidth(), height: Dimensions.getWindowHeight()}}>
                <p>你是第{this.state.rank}个完成{this.state.title[this.props.params.courseId - 1]}的人,给自己点个赞吧!</p>
                <img className="rewar-light" onClick={this.handleClick} src={'./assets7Intro/image/course/bglight.png'}/>
                <img className="reward-pic" onClick={this.handleClick} src={this.state.lockPic[this.props.params.courseId - 1]}/>
                <img className="reward-recommand" onClick = {this.goCommand} src={'./assets7Intro/image/course/recommand.png'}/>
            </div>
        )
    },

    goCommand() {
        Util.postCnzzData("成就卡界面跳转到FM");
        location.href = "https://h5.ichangtou.com/h5/fm/index.html#/mine";
    }
});

module.exports = GetReward;