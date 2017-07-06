/**
 * Created by ichangtou on 2017/6/23.
 */
/**
 * Created by ichangtou on 2017/6/23.
 */
// const Dimensions = require('./Dimensions');

const OnFire = require('onfire.js');
const User = require('../User');
const Util = require('../Util');
const WxConfig = require('../WxConfig');
const MyStorage = require('../GlobalFunc/MyStorage');
const Tools = require('../GlobalFunc/Tools');

const Statistics = require('../GlobalFunc/Statistics');

class BeforeStart {
    static init() {
        console.log('init');
        //0 初始化全局
        this.initGlobal();
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
        console.log(this);
        MyStorage.init();
    }

    static getWhereChannel () {
        let getWhere = sessionStorage.getItem('getWhere');
        if (getWhere) {
            Material.postData('网页人' + getWhere +'_进入_CourseSelect');
            console.log(getWhere);
        }
    }

    static getRedirect() {
        let redictUrl = '/main';
        let goPath = sessionStorage.getItem('goPath');
        if(goPath){
            redictUrl = goPath;
            //如果有课程
            let courseId = Util.getUrlPara('courseId');
            if(courseId) {
                sessionStorage.setItem('courseId',courseId);
                //重定向前,需要请求对应课程的课程状态.
                this.checkUserPayStatue(courseId).then((result)=>{
                    //保存到课程列表中
                    MyStorage.setCourseStatus(courseId,result);
                });
                redictUrl = Tools.setCourseUrl(courseId) + redictUrl;
            }
        }
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
        let f = this.SetCoursePayStatus.bind(this);
        f();
        this.initWxConfig();
    }

    static initWxConfig() {
        WxConfig.initWxConfig();
    }

    static SetCoursePayStatus() {
        //获取课程列表
        let list = MyStorage.getCourseList();
        for( let i = 0; i<list.length; i++) {
            let courseId = list[i];
            this.checkUserPayStatue(courseId).then((result)=>{
                //保存到课程列表中
                MyStorage.setCourseStatus(courseId,result)
            });
        }
    }

    /**
     * 检查用户购买状态
     */
    static checkUserPayStatue(courseId) {
        console.log('enter');
        let returnValue;
        returnValue = MyStorage.getCourseStatus(courseId);
        return new Promise((reslove,reject)=>{
            if(!returnValue) {
                Material.getJudgeFromServer(courseId).done((result)=>{
                    if(result){
                        returnValue = 'pay'
                    } else{
                        returnValue = 'free'
                    }
                    reslove(returnValue);
                }).fail(()=>{

                });
            } else {
                reslove(returnValue);
            }
        });
    }
}

module.exports = BeforeStart;
