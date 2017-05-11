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

const CourseSelect = React.createClass({

    // getInitialState(){
    //     return{
    //         playbarWidth: 0
    //     }

    getInitialState: function() {
        return {
            liked: false,
            dataList: [1,1,0,2,2,0,0],
            courseList: {},
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

        console.log('1.yiran12');
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

        if (User.getUserInfo().userId) {
            this.getCourseList();
        } else {
            OnFire.on('OAUTH_SUCCESS', ()=>{
                this.getCourseList();
            })
        }
    },

    /**
    * 检查用户购买状态
    */
    checkUserPayStatue() {
      Material.getJudgeFromServer().done((result)=>{
          Loading.hideLoading();
          console.log("是否购买：", result);
          if(result){
              console.log('购买过');

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

    render() {
        var text = this.state.liked ? 'like' : 'haven\'t liked';
        return(
            <div className="course-select">
                {this.renderCourseList()}
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
                arr.push(
                    <Link key={i} to={{pathname:"/course/"+ (i + 1), query:{name: courseList[i].status}}}>
                        <LessonBar index = {i} content = {courseList[i]} ></LessonBar>
                    </Link>
                    )
            }
            return arr
        }
    },
});

module.exports = CourseSelect;
