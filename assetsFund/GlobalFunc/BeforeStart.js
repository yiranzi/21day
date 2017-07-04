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
const MyStorage = require('../GlobalFunc/MyStorage');
const Tools = require('../GlobalFunc/Tools');

class BeforeStart {
    static init() {
        console.log('init');
        //0 初始化全局
        this.initGlobal();
        //1 进行异步的userID请求 之后进行必要的请求(付费,设置分享等)
        this.getUserId().then(this.start.bind(this));
        //2 将项目业务需求所需要的参数统统保存起来
        this.getInfoFromUrl();
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
        }
        return redictUrl;
    }

    static getUserId() {
        let userId = User.getUserInfo().userId;
        return Tools.fireRace(userId,"OAUTH_SUCCESS");
    }

    static getInfoFromUrl() {
        //将基金课需要的参数回补
        let linkParamsTypes = ['goPath','getWhere','freeLesson','courseId','name','rank'];
        // let shareTypes = ['getWhere','freeLesson','finish','graduated'];
        for(let i = 0 ;i < linkParamsTypes.length; i++) {
            let getParams = Util.getUrlPara(linkParamsTypes[i]);
            if(getParams){
                sessionStorage.setItem(linkParamsTypes[i],getParams);
            }
        }
    }

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
