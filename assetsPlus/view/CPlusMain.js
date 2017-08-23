/**
 * Created by ichangtou on 2017/6/23.
 */
/**
 * Created by yiran on 2017/5/5.
 */
const $ = window.$ = require('jquery');
const React = require('react');
const Dimensions = require('../Dimensions');
const OnFire = require('onfire.js');
const Tools = require('../GlobalFunc/Tools');
const Util = require('../Util');
const Statistics = require('../GlobalFunc/Statistics');
// const MyStorage = require('../GlobalFunc/MyStorage');

//
const FixedBg = require('../component/course/FixedBg');
const Tabbar = require('../component/home/Tabbar');


const HomeCourseList = require('./page/HomeCourseList');
const MineStatus = require('./page/MineStatus');

const WxConfig = require('../WxConfig');
// const PayPageFund = require('./fund/PayPage');
// const PayPageSeven = require('./seven/PayPage');

const CPlus = React.createClass({
    getInitialState: function() {
        // console.log('123');
        //course lesson
        return {
            content: this.props.content,

            courseList: [],//课程ID列表
            courseStatus: [],//课程状态
            courseContent: ['7天','基金课'],//课程内容信息

            currentPageindex:0,
            tabs:[
                ['./assetsPlus/image/home/tabbar0_0.png','./assetsPlus/image/home/tabbar0_1.png'],
                ['./assetsPlus/image/home/tabbar1_0.png','./assetsPlus/image/home/tabbar1_1.png'],
            ],
            userAdvanceInfo: {},
            modalType: 'null',
            userExpInfo: {
                max: 0,
                current: 0,
                level: -1,
            },
        };
    },

    componentWillMount() {
        //进入长投派界面 courseId 就设置为默认的-1
        let courseId = -1;
        MyStorage.setCourseId(courseId);
        // sessionStorage.removeItem('courseId');
        // MyStorage.whenEnterPage('main');
        this.getUserInfo();
    },

    getUserInfo() {
        let userId = User.getUserInfo().userId;
        Tools.fireRace(userId,"OAUTH_SUCCESS").then(()=>{
            userId = User.getUserInfo().userId;
            Material.getUserAdvanceInfo(userId).done((result)=>{
                this.state.userAdvanceInfo = result;
                this.setState({userAdvanceInfo: this.state.userAdvanceInfo});
            });
            this.initExp();
        });
    },

    initExp() {
        console.log('get');
        Tools.fireRaceExp().then((value)=>{
            console.log('get');
            this.state.userExpInfo = value;
            this.setState({userExpInfo: value});
            //计算经验值
            // this.calcRenderExp();
        });
    },

    initTabbar() {
        let tabs = this.state.tabs;
        let picUrl = './assetsPlus/image/home/tabbar';
        for(let i = 0; i<tabs.length; i++) {
            for(let j = 0; j<tabs[i].length;j++){
                tabs[i][j] = picUrl + i +'_' +j +'.png';
            }
        }
    },

    //渲染
    render() {
        console.log('render!!!!!!!!!!!');
        return(
            <div className="ict-main">
                <FixedBg cbfClick = {this.modalClick} modalType = {this.state.modalType}/>
                {/*top*/}
                {/*mid*/}
                {this.renderMid()}
                {/*bottom*/}
                {this.renderTabbar()}
            </div>
        )
    },

    modalClick(type) {
        console.log('modalClick');
        this.setState({modalType: 'null'});
        switch (type) {
            case 'null':
                break;
            case 'getExp':
                console.log('getExp');
                this.state.userExpInfo = GlobalExp.getLevelUpStack();
                this.setState({userExpInfo: this.state.userExpInfo});
                break;
            case 'levelUp':
                this.state.userExpInfo = GlobalExp.getLevelUpStack();
                this.setState({userExpInfo: this.state.userExpInfo});
                break;
            default:
                break;
        }

    },

    renderMid() {
        let index = this.state.currentPageindex;
        let arr = [];
        switch (index) {
            case 0:
                arr.push(this.renderCourseList());
                break;
            case 1:
                arr.push(this.renderMineStatus());
                break;
        }
        return arr;
    },

    renderCourseList() {
        return(<HomeCourseList></HomeCourseList>)
    },

    cbfModalChange(type) {
        this.setState({modalType: type})
    },

    renderMineStatus() {
        console.log(this.state.userExpInfo);
        return(<MineStatus cbfModalChange = {this.cbfModalChange} userExpInfo = {this.state.userExpInfo} userAdvanceInfo ={this.state.userAdvanceInfo}></MineStatus>)
    },

    //路由跳转
    cbfTabClick(index) {
        Statistics.postDplusData('切换_导航栏',[index]);
        this.state.currentPageindex = index;
        this.setState({currentPageindex: this.state.currentPageindex});
        console.log(index)
    },

    renderTabbar() {
        return(<Tabbar currentIndex = {this.state.currentPageindex} cbfTabClick = {this.cbfTabClick} tabs = {this.state.tabs}/>)
    }
});

module.exports = CPlus;