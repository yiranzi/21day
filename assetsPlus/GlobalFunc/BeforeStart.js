/**
 * Created by ichangtou on 2017/6/23.
 */
/**
 * Created by ichangtou on 2017/6/23.
 */
// const Dimensions = require('./Dimensions');

const OnFire = require('onfire.js');
const User = require('../User');

const WxConfig = require('../WxConfig');

const Tools = require('../GlobalFunc/Tools');

const Statistics = require('../GlobalFunc/Statistics');
const GlobalConfig = require('../GlobalStorage/GlobalConfig');
const Actions = require('../GlobalStorage/Actions');


const Util = require('../Util');

class BeforeStart {
    static init() {
        //0 初始化全局
        this.initGlobal();

        //1 微信设置
        this.initWxConfig();

        //1 进行异步的userID请求 之后进行必要的请求(付费,设置分享等)
        this.getUserId().then(this.start.bind(this));
        //2 将项目业务需求所需要的参数统统保存起来
        this.getInfoFromUrl();
        Statistics.setStaticData();
        //3 截取入口(之后这个操作统一汇总到信息中)
        this.getWhereChannel();
        //4 获取之后要跳转的连接
        let redictUrl = this.getRedirect();
        //5 返回最终连接 跳转
        return redictUrl;
    }

    static initGlobal() {


        //清空有影响的缓存
        // sessionStorage.removeItem('courseId');
        let totalTime = sessionStorage.getItem('startTime');
        sessionStorage.clear();
        sessionStorage.setItem('SstartTime',totalTime);
        console.log(totalTime);
        console.log('clear session');
        MyStorage.setPathNow('入口文件');

        MyStorage.init();
    }
    static getWhereChannel () {
        let getWhere = Util.getUrlPara("getWhere");
        if (getWhere) {
            console.log(getWhere);
        }
    }

    static getRedirect() {
        console.log('enterridict');
        //重定向到main
        let redictUrl = '/main';
        // let redictUrl = '/courseSelect';


        let goPath = MyStorage.getItem('goPath');
        // if (!goPath) {
        //
        // }
        let courseId = MyStorage.getItem('courseId');
        let getWhere = MyStorage.getItem('getWhere');
        //判断特殊渠道(为特殊处理流程)
        if(getWhere === 'autoPush') {
            // goPath = 'courseSelect';
            // courseId = 2;
            // redictUrl = goPath;
            //如果有课程
            // if(courseId) {

            //1设置courseId
            MyStorage.setCourseId(courseId);
            //2获取课程支付信息
            let dataResult = {};
            dataResult.pay = true;
            MyStorage.setCourseStatus(courseId,dataResult);
            sessionStorage.setItem('SisBuy','付费');
            //3设置默认分享(特殊设置)

            //4设置跳转
            // 举例/fund/getReward/
            // redictUrl = Tools.setCourseUrl(courseId) + '/' + redictUrl;

        }
        //判断
        if (goPath) {
            redictUrl = goPath;
            //如果有课程
            if(courseId) {
                //1设置courseId
                MyStorage.setCourseId(courseId);
                //2获取课程支付信息
                //action在特定页面懒发起,这里只负责分发跳转.(但是因为所有的跳转界面都需要这个数据,所以在这里进行处理)
                Actions.ifCourseSignUp(courseId);
                Tools.fireRaceCourse(courseId).then((value)=>{
                    if(parseInt(sessionStorage.getItem('courseId')) === courseId) {
                        if(value.pay){
                            sessionStorage.setItem('SisBuy','付费');
                        } else {
                            sessionStorage.setItem('SisBuy','未付费');
                        }
                    }
                });

                //3设置默认分享

                //4设置跳转
                // 举例/fund/getReward/
                redictUrl = Tools.setCourseUrl() + '/' + redictUrl;
            }
        }
        //加上dayId
        let dayId = MyStorage.getItem('dayId');
        if(dayId){
            redictUrl = redictUrl + '/' + dayId;
        }
        console.log(redictUrl);
        return redictUrl;
    }

    static getUserId() {
        let userId = User.getUserInfo().userId;
        return Tools.fireRace(userId,"OAUTH_SUCCESS");
    }

    //userId        - 这个用户的userId

    //ictchannel    - 上线/null
    //goPath        - 跳转到哪里(着陆页)/null
    //getWhere      - 哪个渠道来的/null
    //courseId      - 哪个课程/null(从入口进入,之后再赋值)    这个值在分享链接的时候要再次加进去
    //shareType     - 高级/低级/普通/null

    //上下线
    //isBuy         -??

    //pathFrom      - 从哪里来
    //pathNow       - 到哪里

    //分享
    //dayId         - 第几天的课程/null   这个值需要修改



    //这里面用于保存逻辑上需要的东西.从url中获取到的
    static getInfoFromUrl() {

    }

    //这里面保存从url中截取并用于数据统计的东西
    //如果这个统计里面有别的连带参数,也一并获取并加入进去
    //用户类型userType,上线ID,登陆页,渠道,免费课


    //现在判断购买情况放在这里.
    //因为流程上需要先登录userInfo 在进行购买判定.
    //这个过程写在这里.当得到结果后统一发送Onfire就可以.
    static start() {
        // let f = this.SetCoursePayStatus.bind(this);
        // f();
    }

    static initWxConfig() {
        WxConfig.initWxConfig();
    }

    // static SetCoursePayStatus() {
    //     //获取课程列表
    //     let list = MyStorage.getCourseList();
    //     for( let i = 0; i<list.length; i++) {
    //         let courseId = list[i];
    //         this.checkUserPayStatue(courseId).then((result)=>{
    //             //保存到课程列表中
    //             MyStorage.setCourseStatus(courseId,result)
    //         });
    //     }
    // }


}

module.exports = BeforeStart;
