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
// const GetReword = require('./GetReword');

const CourseSelect = React.createClass({


    getInitialState: function() {
        return {
            liked: false,
            dataList: [1,1,0,2,2,0,0],
            courseList: {},
            tips:[],
            treasure: {
                status: -1,
                haveOpen: true,
                canOpen: false,
                canView: false,
            }
        };
    },

    componentWillMount() {
      // TODO roy 判断用户当前的购买状态，未购买则直接跳转到支付页面
      // 购买后留在关卡页面
        // 测试提交
        let courseId = Util.getUrlPara('courseId');
        if(courseId) {
            Loading.hideLoading();
            location.hash = '/getReward/' + courseId;
        } else {
            let userId = User.getUserInfo().userId;
            console.log("===userId = " + userId);
            if (userId) {

                this.checkUserPayStatue();
            } else {
                OnFire.on(Config.OAUTH_SUCCESS, ()=>{
                    this.checkUserPayStatue();
                });
            }
        }
    },

    /**
    * 检查用户购买状态
    */
    checkUserPayStatue() {
      Material.getJudgeFromServer().done((result)=>{
          Loading.hideLoading();
          console.log("关卡页面判断是否购买：", result);

          // TODO test roy
          // location.hash = "/payPage";

          if(result){
              console.log('显示关卡列表');
              this.init()


          } else{ // 未购买直接跳到购买页面
              location.hash = "/payPage";
          }
      }).fail(()=>{

      });
    },

    init() {
        console.log('init');
        //获取宝箱信息1
        Material.getTreasureInfo().always( (data) => {
            console.log(data)
            //TODO 测试下这块的逻辑
            //如果未领取.
            if(!data) {
                this.state.treasure.haveOpen = false;
                this.setState({treasure: this.state.treasure});
            }
        })
        //获取听课列表
        this.getCourseList();
    },


    getCourseList () {
        Material.getCourseList().always( (data) => {
            this.setState({courseList: data})
        })
    },

    render() {
        return(
            <div className="course-list">
                <FixedBg/>
                <div>
                    {this.renderTreasure()}
                    {this.renderCourseList()}
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
                //TODO 应该是-1表示未解锁11
                if (courseList[i].status !== -1) {
                    arr.push(
                        <Link className="lesson-bar" key={i} to={{pathname:"/course/"+ (i + 1), query:{name: courseList[i].status}}}>
                            <LessonBar index = {i} content = {courseList[i]} ></LessonBar>
                        </Link>
                    )
                } else {
                    console.log('不能听的')
                    arr.push(
                        <div className="lesson-bar" onClick={this.renderNotEnter.bind(this,i)}>
                            <LessonBar key={i} index = {i} content = {courseList[i]}></LessonBar>
                        </div>
                    )
                }

            }
            return arr
        }
    },

    renderNotEnter(index) {
        console.log('render no enter');
        window.dialogAlertComp.show('还没有开放课程哦','每天更新一课哦，耐心等一等吧！','知道啦',()=>{},()=>{},false);
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
        return <img onClick={this.openTreasure} className="fix-treasure" src={'./assets7Intro/image/course/treasure.png'}/>


    },

    calcTreasureInfo() {
        let treasure =  this.state.treasure;
        if(treasure.canView) {
            //
            treasure.status = 0;
        }else if(!treasure.canOpen) {
            //不可以打开,因为没有完成所有的课程
            treasure.status = 0;
        } else if (this.state.treasure.canOpen) {
            //可以打开
            treasure.status = 1;
        }
        else if (!treasure.haveOpen) {
            //不可以打开,页还没打开
            treasure.status = 3;
        } else {
            //已经领取
            treasure.status = 2;
        }
    },

    openTreasure() {
        // let courseId = Util.getUrlPara('courseId');
        let courseId = 8;
        if(courseId) {
            Loading.hideLoading();
            location.hash = '/getReward/' + courseId;
        }
        return;
        Util.postCnzzData("点击宝箱");
        if(this.state.treasure.canView) {
            if(this.state.treasure.canOpen){
                if(this.state.treasure.haveOpen) {
                    //领了
                    window.dialogAlertComp.show('你已经领取过宝箱啦','使用长投FM来道具商城使用奖励吧！','好的',()=>{
                        location.href = "https://h5.ichangtou.com/h5/fm/index.html#/mine";
                    },()=>{},false);
                } else {
                    //听完课,还没领,
                    Material.openTreasure().always( (data) => {
                        //弹出打开宝箱的界面1
                        if(data.status)
                        {
                            Util.postCnzzData("成功领取宝箱");
                            this.state.treasure.haveOpen = true;
                            window.dialogAlertComp.show('领取了50金币！','快去长投FM听Lip师兄的更多理财秘籍吧！','去看看',()=>{
                                Util.postCnzzData("宝箱跳转FM");
                                location.href = "https://h5.ichangtou.com/h5/fm/index.html#/mine";},'等一等',true);
                            // location.hash = '/getReward/' + 1;
                        } else {
                            Util.postCnzzData("失败领取宝箱",data.msg);
                            window.dialogAlertComp.show(data.msg,'来长投网公众号收听长投FM！让你的财商指数增长吧！','原来如此',()=>{},()=>{},false);
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
