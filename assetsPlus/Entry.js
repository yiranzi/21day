/**
 * Created by lip on 2016/6/3.
 */
var $ = window.$ = require('jquery');
var React = require('react');
var ReactDom = require('react-dom');

var Dimensions = require('./Dimensions');
var Util = require('./Util');
var User = require('./User');
var Loading = require('./Loading');

//全局的
//工程中用到的
var style = require('./css/style.scss');
var DialogAlert = require('./component/DialogAlert');

var InnerRouter = require('./InnerRouter');
var BeforeStart = require('./GlobalFunc/BeforeStart');
var MyStorage = require('./GlobalFunc/MyStorage');

let test = true;

//上报启动时间
let endTime = new Date().getTime();
let startTime = sessionStorage.getItem('startTime');
let totalTime = 0;
if(startTime) {
    totalTime = endTime - startTime;
    totalTime = totalTime/1000;
    // totalTime = parseInt(totalTime);
}
startTime = sessionStorage.setItem('startTime',totalTime);
window.dplus.track('FinishRes',{'TotalCost': totalTime});
// alert('FinishRes' + totalTime);

//初始化用户信息1
// alert("bundle ready");
User.initAccessInfo();
$(document).ready(() => {
    // alert("html ready");
    if(!Util.isWeixin()){
        if(test) {
            alert('请复制地址并在微信中打开');
            new Dimensions().init();
            User.setUserIdTest('8588d5124d1541c0b8656d675cee761d');
            let goWhere = BeforeStart.init();
            ReactDom.render(<InnerRouter goWhere = {goWhere}/>, $('#root')[0]);
        } else {
            Loading.hideLoading();
            window.dialogAlertComp.show('提示','请复制地址并在微信中打开','知道啦',()=>{
                Loading.showLoading('获取信息...');
            },()=>{},false);
        }
    } else {
        if( Util.getUrlPara('code') ) {
            new Dimensions().init();
            Loading.showLoading('获取信息...');
            //尺寸初始化
            let goWhere = BeforeStart.init();
            ReactDom.render(<InnerRouter goWhere = {goWhere}/>, $('#root')[0]);
            // alert("start react");
        }
    }

});
