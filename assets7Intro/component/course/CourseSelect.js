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
      let userId = User.getUserInfo().userId;
      console.log("===userId = " + userId);
      if (userId) {
            this.checkUserPayStatue();
      } else {
        OnFire.on(Config.OAUTH_SUCCESS, ()=>{
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
    // render() {
    //     return(
    //         <Father></Father>
    //     )
    // },



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
                    arr.push(
                        <div className="lesson-bar" onClick={this.renderNotEnter.bind(this,i)}>
                            <LessonBar key={i} index = {i} content = {courseList[i]}>12345</LessonBar>
                        </div>
                    )
                }

            }
            return arr
        }
    },

    //点击成就卡回调
    OnPicClick (index) {
        console.log('onPicClick');
        if(this.state.courseList[index].status === 2) {
            location.hash = '/getReward/' + index;
            console.log('click pic')
        } else {
            console.log('click pic222');
            window.dialogAlertComp.show('还没有开放课程哦','每天更新一课哦,耐心等一等吧,可以微信关注长投网','知道啦',()=>{},()=>{},false);
        }

    },

    renderNotEnter(index) {
        console.log('render no enter');
        window.dialogAlertComp.show('还没有开放课程哦','每天更新一课哦,耐心等一等吧,可以微信关注长投网','知道啦',()=>{},()=>{},false);
    },

    renderTreasure() {
        console.log('render treasure');
        let courseList = this.state.courseList;
        let countUnlock = 0;
        let countPass = 0;
        let countTotle = this.state.courseList.length;
        let result = 0;
        for ( let i = 0; i < courseList.length; i++){
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
        if (this.state.treasure.canView) {
            // return(<div className="lesson-bar" onClick={this.openTreasure}>
            //         <TreasureBar treasure = {this.state.treasure}></TreasureBar>
            //         </div>)
            return <img onClick={this.openTreasure} className="fix-treasure" src={'./assets7Intro/image/course/indFinished.png'}/>
        }

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
        if(this.state.treasure.canView) {
            if(this.state.treasure.canOpen){
                if(this.state.treasure.haveOpen) {
                    //领了
                    window.dialogAlertComp.show('你已经领取过宝箱啦','微信关注"长投网"公众号.使用长投FM来使用奖励吧！','好的',()=>{},()=>{},false);
                } else {
                    //听完课,还没领,
                    Material.openTreasure().always( (data) => {
                        //弹出打开宝箱的界面1
                        console.log('click');
                        console.log(data);
                        if(data.status)
                        {
                            location.hash = '/getReward/' + 1;
                        } else {
                            window.dialogAlertComp.show(data.msg,'微信关注"长投网"公众号.让你的财商指数增长吧！','原来如此',()=>{},()=>{},false);
                        }
                    })
                }
            } else {
                ////到了第七天,还没听完课
                window.dialogAlertComp.show('毕业宝箱等着你呢！','完成全部的作业,全部Finish之后领取你的毕业证和毕业宝箱吧！加油！','我会加油的',()=>{},()=>{},false);
            }
        } else {
            //还没有到第七天
            window.dialogAlertComp.show('毕业宝箱等着你呢！','坚持就是胜利呦,完成7天课程,领取你的毕业证和毕业宝箱吧！加油！','我会加油的',()=>{},()=>{},false);
        }
    }
});

module.exports = CourseSelect;
