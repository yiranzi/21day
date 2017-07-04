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


var style = require('./css/style.scss');

var InnerRouter = require('./InnerRouter');
var BeforeStart = require('./GlobalFunc/BeforeStart');
// alert(Util.getUrlPara('code'));
// if( !Util.getUrlPara('code') ) {
//     alert("2.5");
//     User.redirectToBaseInfo();
// }

////初始化用户信息
alert("bundle ready");
User.initAccessInfo();

$(document).ready(() => {
    alert("html ready");
    if(!Util.isWeixin()){
        Loading.hideLoading();
        window.dialogAlertComp.show('提示','请复制地址并在微信中打开','知道啦',()=>{
            Loading.showLoading('获取信息...');
        },()=>{},false);
    }


    if( Util.getUrlPara('code') ) {
        new Dimensions().init();
        Loading.showLoading('获取信息...');
        //尺寸初始化
        let goWhere = BeforeStart.init();
        ReactDom.render(<InnerRouter goWhere = {goWhere}/>, $('#root')[0]);
        alert("start react");
    }

});
