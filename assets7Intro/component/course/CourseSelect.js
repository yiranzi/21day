/**
 * Created by yiran on 2017/5/5.
 */
const $ = window.$ = require('jquery');
const React = require('react');
const ReactDom = require('react-dom');
const OnFire = require('onfire.js');
const User = require('../../User');

const Config = require('../../Config');
const Link = require('react-router').Link;
const LessonBar = require('./LessonBar');
const FixedBg = require('./FixedBg');
var boolOnce = true;
// const GetReword = require('./GetReword');

const CourseSelect = React.createClass({


    getInitialState: function() {
        return {
            courseList: {},
            tips:[],
            treasure: {
                status: -1,
                haveOpen: true,
                canOpen: false,
                canView: false,
            },
            allFinish: false,//所有课程都完成.
            allowLesson: 'FREE',//用户听课权限
        };
    },

    componentWillMount() {
        //判断连接是否需要跳转
        let goPath = Util.getUrlPara('goPath');
        if(goPath){
            let getWhere = Util.getUrlPara('getWhere');
            if (getWhere) {
                Material.postData('网页人' + getWhere +'_进入_CourseSelect');
                console.log(getWhere);
            }
            location.hash = goPath;
            return;
        }
        let userId = User.getUserInfo().userId;
        console.log("===userId = " + userId);
        //判断用户当前的购买状态，未购买则直接跳转到支付页面
        if (userId) {
            //1.判断听课状态.
            this.checkUserPayStatue();
        } else {
            OnFire.on(Config.OAUTH_SUCCESS, ()=>{
                //1.判断听课状态.
                this.checkUserPayStatue();
            });
        }
    },

    /**
     * 检查用户购买状态
     */
    checkUserPayStatue() {
        Material.getJudgeFromServer().done((result)=>{
            Loading.hideLoading();
            if(result){
                this.state.allowLesson = 'PAY';
                this.init();
            } else{ // 未购买直接跳到购买页面
                this.state.allowLesson = 'FREE';
                location.hash = "/payPage";
            }
            this.setState({allowLesson: this.state.allowLesson});
        }).fail(()=>{

        });
    },

    init() {
        //支付页首页-判定支付状态 || 课程页首页-渲染列表


        //0.获取听课列表
        this.getCourseList();

        //2.获取宝箱信息
        Material.getTreasureInfo().always( (data) => {
            //如果未领取.
            if(!data) {
                this.state.treasure.haveOpen = false;
                this.setState({treasure: this.state.treasure});
            }
        })
    },


    getCourseList () {
        Material.getCourseList().always( (data) => {
            this.setState({courseList: data})
            for( let process of this.state.courseList) {
                if (process.status !== 2) {
                    return;
                }
            }
            //如果课程都通过了,并且没有领取宝箱.
            if(!this.state.treasure.haveOpen){
                this.setState({allFinish: true})
            }
        })
    },

    render() {
        return(
            <div className="course-list">
                <FixedBg/>
                <div>
                    {this.renderTreasure()}
                    {this.renderCourseList()}
                    {this.renderGraduated()}
                    {this.reloadPic()}
                </div>
            </div>
        )
    },

    renderCourseList() {
        let courseList = this.state.courseList;
        let arr = [];
        if(!courseList || courseList.length === 0 ){
            return null;
        } else {
            for (let i = 0; i < courseList.length; i++) {
                //计算出来状态,并赋值.
                this.calcCourseStatus(courseList[i], i);
                arr.push(
                    <div className="lesson-bar">
                        <LessonBar  index = {i} content = {this.state.courseList[i]} cbfGoLesson = {this.cbfGoLesson} cbfSeeReward = {this.cbfSeeReward}></LessonBar>
                    </div>
                );
                // switch (courseStatus) {
                //     //没有达到听课时间
                //     case -1:
                //         //TODO 后台上线后 先获得列表 获得报名结果 修改课程类型 判定能否上的时间 再根据免付费用户,结合课程的后台类型进行判定.
                //         if (this.state.allowLesson === 'FREE') {
                //             arr.push(this.renderLesson(i,courseList[i]));
                //         } else {
                //             arr.push(
                //                 <div className="lesson-bar" onClick={this.renderNotEnter.bind(this,i)}>
                //                     <LessonBar  index = {i} content = {courseList[i]}></LessonBar>
                //                 </div>
                //             );
                //         }
                //         break;
                //     //不为-1
                //     default:
                //         arr.push(this.renderLesson(i,courseList[i]));
                //         break;
                // }
            }
            return arr
        }
    },

    calcCourseStatus(course, index) {
        let courseStatus = {
            see: false,
            enter: '',
            allFinish: false,
            reward: 'not-get',
        };
        switch (this.state.allowLesson) {
            //如果是免费用户
            case 'FREE':
                courseStatus.reward = 'free-not-get';
                //TODO 服务器的课程标签 如果是免费课
                if (index === 0) {
                    courseStatus.see = true;//可以看到
                    courseStatus.enter = 'free-enter';
                    switch (course.status) {
                        case -1:
                            break;
                        case 0:
                            break;
                        case 1:
                            break;
                        case 2:
                            courseStatus.allFinish = true;
                            courseStatus.reward = 'free-not-get';
                            break;
                        default:
                            console.log('error' + course.status);
                    }
                } else {
                    courseStatus.see = false;
                    courseStatus.enter = 'free-no-pay';
                }
                break;
            //如果是付费用户
            case 'PAY':
                //先判定是否可以收听.
                switch (course.status) {
                    case -1:
                        courseStatus.enter = 'no-time';
                        break;
                    case 0:
                        courseStatus.see = true;//可见
                        courseStatus.enter = 'pay';
                        break;
                    case 1:
                        courseStatus.see = true;//可见
                        courseStatus.enter = 'pay';
                        break;
                    case 2:
                        courseStatus.see = true;//可见
                        courseStatus.enter = 'pay';
                        courseStatus.allFinish = true;
                        courseStatus.reward = 'get';
                        break;
                    default:
                        console.log('error' + course.status);
                }
                break;
        }
        this.state.courseList[index].courseStatus = courseStatus;//赋值.
    },

    //type听课3种课程.
    //F 免费课.
    //S 邀请试听课.
    //P 付费课.
    //这部分可以在点击后统一处理.一个render不同的绘制点击结果.
    // renderLesson(index,courseList) {
    //     let arr = [];
    //     //TODO type表示课程类型.
    //     if (index === 0) {
    //         courseList.type = 'F';
    //     } else {
    //         courseList.type = 'P';
    //     }
    //     arr.push(
    //         <div className="lesson-bar">
    //             <LessonBar  index = {index} content = {courseList} cbfGoLesson = {this.cbfGoLesson} cbfSeeReward = {this.cbfSeeReward}></LessonBar>
    //         </div>
    //     );
    //     // switch (courseList.type){
    //     //     case 3:
    //     //         //点击后,显示不能播放,然后显示跳转过去.
    //     //         //第一次完成免费/试听后,会有付费的流程.
    //     //         //这个地方也许要...提示免费课程还有多少
    //     //         arr.push(
    //     //             <div className="lesson-bar">
    //     //                 <LessonBar  index = {index} content = {courseList} cbfGoLesson = {this.cbfGoLesson} cbfSeeReward = {this.cbfSeeReward}></LessonBar>
    //     //             </div>
    //     //         );
    //     //         break;
    //     //     default:
    //     //         arr.push(
    //     //             <Link className="lesson-bar" to={{pathname:"/course/"+ (index + 1)}}>
    //     //                 <LessonBar index = {index} content = {courseList} ></LessonBar>
    //     //             </Link>
    //     //         );
    //     //         break;
    //     // }
    //     return arr;
    // },

    //跳转到听课界面
    cbfGoLesson(course, index) {
        let status = course.courseStatus;
        let courseId = this.state.courseList[index].id;
        switch (status.enter) {
            case 'free-enter':
                Material.postData('免费_试听_CourseSelect');
                location.hash = '/course/' + courseId;
                break;
            case 'free-no-pay':
                Material.postData('免费_禁止_CourseSelect');
                window.dialogAlertComp.show('7天财商训练营','每天更新一课，为你量身定做的理财指南课程，只需要7天，带着你财商涨涨涨！','去看看',()=>
                {location.hash = '/payPage';Material.postData('免费_跳转购买_CourseSelect');},'先不要',true);
                break;
            case 'pay':
                location.hash = '/course/' + courseId;
                break;
            case 'no-time':
                window.dialogAlertComp.show('还没有开放课程哦','每天更新一课哦，耐心等一等吧！','知道啦',()=>{},()=>{},false);
                break;
            default:
                console.log('error' + status.enter);
                break;
        }
    },


    //点击成就卡回调函数
    cbfSeeReward(course, index) {
        let status = course.courseStatus;
        let courseId = this.state.courseList[index].id;
        switch (status.reward) {
            case 'free-not-get':
                location.hash = '/course/' + courseId;
                break;
                // window.dialogAlertComp.show('你未完成课程,不能查看成就卡','快去完成吧','完成',()=>
                // {location.hash = '/course/' + courseId;},'先不去',false);
                break;
            case 'free-get':
                //如果已获得成就卡
                location.hash = '/course/' + courseId;
                // location.hash = '/getReward/' + courseId;
                break;
            case 'not-get':
                window.dialogAlertComp.show('你未完成课程,不能查看成就卡','快去完成吧','完成',()=>
                {location.hash = '/course/' + courseId;},'先不去',true);
                break;
            case 'get':
                //如果已获得成就卡
                location.hash = '/getReward/' + courseId;
                break;
            default:
                console.log('error' + status.reward);
                break;
        }
    },

    //可以领取宝箱,自动滚动
    componentDidUpdate() {
        if(boolOnce){
            if(this.state.treasure.canOpen){
                scrollTo(0,999);
                boolOnce = false;
            }
        }

    },

    //预加载毕业证的大图.
    reloadPic() {
        //如果可以领取
        if(this.state.treasure.canOpen){
            return(
                <div className="reload-bg" style = {{backgroundImage: 'url("./assets7Intro/image/course/graduated.png")'}}></div>
            )
        }
    },



    renderTreasure() {
        console.log('render treasure');
        let courseList = this.state.courseList;
        if (!courseList.length || courseList.length === 0) {
            return null;
        }
        let countUnlock = 0;
        let countPass = 0;
        let countTotle = this.state.courseList.length;
        let result = 0;
        for ( let i = 0; i < courseList.length; i++ ){
            result = courseList[i].status;
            if (result !== -1) {
                countUnlock++;
            }
            if (result === 2) {
                countPass++;
            }
        }
        if( countUnlock === countTotle ) {
            this.state.treasure.canView = true;
        }
        if( countPass === countTotle ) {
            this.state.treasure.canOpen = true;
        }
        // this.calcTreasureInfo();

        // return(<div className="lesson-bar" onClick={this.openTreasure}>
        //         <TreasureBar treasure = {this.state.treasure}></TreasureBar>
        //         </div>)
        return <img onClick={this.openTreasure} className={this.state.allFinish ? 'fix-treasure-shake' : 'fix-treasure'} src={'./assets7Intro/image/course/treasure.png'}/>


    },

    // calcTreasureInfo() {
    //     let treasure =  this.state.treasure;
    //     if(treasure.canView) {
    //         //
    //         treasure.status = 0;
    //     }else if(!treasure.canOpen) {
    //         //不可以打开,因为没有完成所有的课程
    //         treasure.status = 0;
    //     } else if (this.state.treasure.canOpen) {
    //         //可以打开
    //         treasure.status = 1;
    //     }
    //     else if (!treasure.haveOpen) {
    //         //不可以打开,页还没打开
    //         treasure.status = 3;
    //     } else {
    //         //已经领取
    //         treasure.status = 2;
    //     }
    // },

    renderGraduated(){
        if(this.state.treasure.canOpen){
            return(
                <div>
                    <img className="graduatedButton" onClick={this.openGraduated} src={'./assets7Intro/image/course/graduatedButton.png'}/>
                </div>
            )
        } else if(this.state.courseList.length && this.state.courseList.length !== 0){
            return(
                <div>
                    <div className="show-group" onClick={this.showGroup}>点我加入7天学习群</div>
                </div>
            )
        }
    },

    showGroup() {
        window.dialogAlertComp.show('快来加入7天学习群','在群里可以分享到理财干货，更有师兄直播讲课答疑哦！快来吧','点击加群',()=>
        {location.href = "https://jq.qq.com/?_wv=1027&k=49fUv5j";},'先不要',true)
    },

    openGraduated() {
        Util.postCnzzData("点击毕业证");
        Material.getGraduatedRank().always( (rank) => {
            //2如果请求道有效值
            // rank !== -1
            if ( rank!== -1 ) {
                let courseId = 8;
                if (courseId) {
                    location.hash = '/getGraduated/mine';
                }
            } else {
                window.dialogAlertComp.show('还不能领取毕业证哦！','你还没有完成全部课程呢，要都通过才行哦。','好的',()=>{},'',false);
            }
        });
    },

    openTreasure() {
        if(this.state.treasure.canView) {
            if(this.state.treasure.canOpen){

                if(this.state.treasure.haveOpen) {
                    //领了
                    window.dialogAlertComp.show('你已经领取过宝箱啦','使用长投FM去积分商城兑换奖励吧！','去看看',()=>{
                        location.href = "https://h5.ichangtou.com/h5/fm/index.html#/mall";},'等一等',true);
                } else {
                    //听完课,还没领,
                    //1如果可以完成毕业证
                    Material.openTreasure().always( (data) => {
                        //弹出打开宝箱的界面1
                        if(data.status)
                        {
                            Util.postCnzzData("成功领取宝箱");
                            this.state.treasure.haveOpen = true;
                            window.dialogAlertComp.show('领取了50金币！','使用长投FM去积分商城兑换奖励吧！','去看看',()=>{
                                Util.postCnzzData("宝箱跳转FM");
                                location.href = "https://h5.ichangtou.com/h5/fm/index.html#/mall";},'等一等',true);
                        } else {
                            Util.postCnzzData("失败领取宝箱",data.msg);
                            window.dialogAlertComp.show(data.msg,'领取失败了','我知道了',()=>{},()=>{},false);
                        }
                    })
                }
            } else {
                ////到了第七天,还没听完课
                window.dialogAlertComp.show('毕业宝箱等着你！','完成了7天所有的训练才能获得毕业宝箱！希望就在前方！','我没问题的',()=>{},()=>{},false);
            }
        } else {
            //还没有到第七天
            window.dialogAlertComp.show('毕业宝箱等着你！','完成7天的训练后，才可以领取毕业证和宝箱噢。加油！','我会加油的',()=>{},()=>{},false);
        }
    }
});

module.exports = CourseSelect;
