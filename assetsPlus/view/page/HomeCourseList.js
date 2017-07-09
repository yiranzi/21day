/**
 * Created by ichangtou on 2017/6/23.
 */
/**
 * Created by yiran on 2017/5/5.
 */
const React = require('react');
const Tools = require('../../GlobalFunc/Tools');
const Util = require('../../Util');
const Material = require('../../Material');
const Statistics = require('../../GlobalFunc/Statistics');
const MyStorage = require('../../GlobalFunc/MyStorage');
const WxConfig = require('../../WxConfig');

// const Loading = require('../../Loading');

//
// const PayPageFund = require('./fund/PayPage');
// const PayPageSeven = require('./seven/PayPage');

const HomeCourseList = React.createClass({
    getInitialState: function() {
        // console.log('123');
        //course lesson
        return {
            content: this.props.content,

            courseList: [],//课程ID列表
            courseStatus: [],//课程状态
            courseContent: ['./assetsPlus/image/home/course_seven.png','./assetsPlus/image/home/course_fund.png'],//课程内容信息

        };
    },

    componentWillMount() {
        // Statistics.setPathNow('长投家');
        Loading.hideLoading();
        console.log('enter courseList');

        //0 设置页面默认分享
        // WxConfig.shareConfig(shareTitle,desc,link);
        //1 获取课程ID
        this.getCourseList();
        //2 根据课程列表获取课程信息
        this.getCourseContent();
        //3 根据课程Id获取用户相关数据
        this.getCourseStatus();
    },

    //获取列表并初始化
    getCourseList() {
        let courseList = this.state.courseList = MyStorage.getCourseList();
        for( let i = 0; i<courseList.length; i++) {
            this.state.courseStatus[courseList[i]] = {};
        }
    },

    getCourseContent() {

    },

    //根据列表获取购买情况
    getCourseStatus() {
        let courseList = this.state.courseList;
        for( let i = 0; i<courseList.length; i++) {
            let courseId = courseList[i];
            Tools.fireRaceCourse(courseId).then((value)=>{
                this.state.courseStatus[courseId].payStatus = value;
                this.setState({courseStatus: this.state.courseStatus});
            })
        }
        //首先,这是一个课程列表
        //每个列表关心自己的课程状态
        //让他们分别去获取.fireRace
        //如果拿到的ID是自己的.那么执行逻辑
        //如果不是自己的.那么继续等待
        //或者是保存完所有的之后统一进行
        //因为课程状态没办法精确
    },

    goRouter(courseId,type) {
        //当抓到courseId后都需要一系列操作
        //设置微信
        //设置id
        //获取课程状态
        Loading.showLoading('获取课程中...');
        let enterWhere;

        //0保存上当前的课程ID
        sessionStorage.setItem('courseId',courseId);
        WxConfig.shareConfig();
        Tools.fireRaceCourse(courseId).then((value)=>{
            Loading.hideLoading();
            if (value === 'pay') {
                enterWhere = '/courseSelect';
            } else {
                enterWhere = '/payPage';
            }
            Tools.MyRouter('',enterWhere);
        });

        // switch (type) {
        //     case 0:
        //         Tools.MyRouter('PayPage','/payPage');
        //         break;
        //     case 1:
        //         Tools.MyRouter('CourseSelect','/courseSelect');
        //         break;
        // }

    },



    //渲染
    render() {
        return(
            <div className="home-course-list">
                <div>
                    <div className="course-banner">banner</div>
                    <div className="course-list">
                        {this.renderCourseList()}
                        {/*{this.renderCourseList2()}*/}
                    </div>
                </div>
            </div>
        )
    },


    renderCourseList(){
        let arr =[];
        let courseList = this.state.courseList;
        for(let i = 0;i<courseList.length;i++) {
            arr.push(<div className="course-content-line" key={i} onClick={this.goRouter.bind(this,courseList[i])}>
                <img className="course-line-img" src={this.state.courseContent[i]}/>
            </div>)
        }
        return arr;
    },

    renderCourseList3() {
        let arr =[];
        let courseList = this.state.courseList;
        for(let i = 0;i<courseList.length;i++) {
            arr.push(<div className="course-content-line" key={i} onClick={this.goRouter.bind(this,courseList[i],0)}>
                <span>课程ID为{courseList[i]}</span>
                <span>课程名称为{this.state.courseContent[i]}</span>
                <span>课程状态为{this.state.courseStatus[i].payStatus}</span>
            </div>)
        }
        return arr;
    },



    renderCourseList2(){
        let arr =[];
        let courseList = this.state.courseList;
        for(let i = 0;i<courseList.length;i++) {
            arr.push(<div className="course-content-line" key={i} onClick={this.goRouter.bind(this,courseList[i],1)}>
                <span>课程ID为{courseList[i]}</span>
                <span>课程名称为{this.state.courseContent[i]}</span>
                <span>课程状态为{this.state.courseStatus[i].payStatus}</span>
            </div>)
        }
        return arr;
    }
});

module.exports = HomeCourseList;