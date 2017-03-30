/**
 * Created by Administrator on 16-12-22.
 */
const React = require('react');
const ReactDom = require('react-dom');
const $ = require('jquery');
const OnFire =require('onfire.js');
const GHGuider = require('./GHGuider');

const User = require('../User');
const Dimensions = require('../Dimensions');
const PayController = require('../PayController');
const Util = require('../Util');
const Material = require('../Material');
const Loading = require('../Loading');
const DialogAlert = require('./DialogAlert');
const DoneToast = require('./DoneToast');


const SharePanel = React.createClass({

    getPropsType(){
        return {
            onClose: React.PropTypes.func.isRequired
        }
    },

    clickHandler() {
        this.props.onClose();
    },


    /**
     *
     * @returns {XML}
     */
    render(){
        return (<div className="share-panel-view">
            <p className="share-title">邀请好友参加训练营</p>
            <img src="./assets21Intro/image/sharePacket.png" className="share-img"/>
            <p className="share-desc">首次分享报名链接给好友/到朋友圈</p >
            <p className="share-desc">即可获得现金红包一个！</p >
            <p className="share-desc">好友通过链接报名立享3元优惠</p >
            <p className="share-desc">成功报名后你还能收到现金红包！</p >
            <p className="share-desc">中奖率100%哦！</p >
            <p className="share-title">爱TA就带TA理财</p>
            <div className="share-confirm-button" onClick={this.clickHandler}>知道了</div>
        </div>)
    }


});

module.exports = SharePanel;