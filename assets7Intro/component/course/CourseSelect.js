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
const Father = require('./Father');
// const GetReword = require('./GetReword');

const CourseSelect = React.createClass({


    getInitialState: function() {
        return {
            liked: false,
            dataList: [1,1,0,2,2,0,0],
            courseList: {},
            haveOpen: [],
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

        console.log('1.yiran112');
        if (!this.counter) {
            this.counter = 0;
        }
        this.counter = this.counter + 1
        //TODO 接收完成课程.缺少参数.1
        // OnFire.on('Pass_Lesson',this.keepgoing);
        //
        OnFire.on('Pass_Lesson', (index)=>{
            console.log('接收到作业通过的回调');
            this.state.dataList[index] = 3;
            let localData = this.state.dataList;
            console.log(this.state.dataList);
            // this.setState({dataList: localData});
        })
        console.log('push ajax')

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


    handleClick: function(event) {
        this.setState({liked: !this.state.liked});
    },

    getCourseList () {
        Material.getCourseList().always( (data) => {
            this.setState({courseList: data})
        })
    },

    // render() {
    //     return(
    //         <div>
    //             <FixedBg/>
    //             <div>
    //                 {this.renderCourseList()}
    //                 {this.renderTreasure()}
    //             </div>
    //         </div>
    //     )
    // },
    render() {
        return(
            <Father></Father>
        )
    },

    renderCourseList() {
        let courseList = this.state.courseList;
        let arr = [];
        if(!courseList || courseList.length === 0 ){
            return null;
        } else {
            for (let i = 0; i < courseList.length; i++) {
                //TODO 应该是-1表示未解锁111
                if (courseList[i].status !== -1) {
                    arr.push(
                        <Link key={i} to={{pathname:"/course/"+ (i + 1), query:{name: courseList[i].status}}}>
                            <LessonBar index = {i} content = {courseList[i]} ></LessonBar>
                        </Link>
                    )
                } else {
                    arr.push(
                        <div onClick={this.renderNotEnter.bind(this,1)}>
                            <LessonBar key={i} index = {i} content = {courseList[i]}>12345</LessonBar>
                        </div>
                    )
                }

            }
            return arr
        }
    },

    renderNotEnter(index) {
        window.dialogAlertComp.show('还没有开放课程哦','每天更新一课哦,耐心等一等吧,可以微信关注长投网','知道啦',()=>{},()=>{},false);
    },

    renderTreasure() {
        return (<div onClick={this.openTreasure}></div>)
    },

    openTreasure() {
        console.log('click');
        location.hash = '/getReward/' + 1;

        // for (let i in this.state.haveOpen) {
        //     if(i === 'treasure2') {
        //         Material.openTreasure().always( (data) => {
        //             //弹出打开宝箱的界面1
        //             console.log(data)
        //         })
        //     }
        // }
    },

    init() {
        console.log('init');
        //获取宝箱信息1
        Material.getTreasureInfo().always( (data) => {
            console.log(data)
            if(data) {
                this.state.haveOpen.push('treasure2');
                this.setState({haveOpen: this.state.haveOpen});
            }
        })
        this.getCourseList();
    }
});

module.exports = CourseSelect;
