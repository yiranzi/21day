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


    render(){
        return (<div className="share-panel-view">
            <p className="share-title">邀请好友参加训练营</p>
            <img src="./assets21Intro/image/sharePacket.png" className="share-img"/>
            <p className="share-desc">好友可获得3元报名优惠</p>
            <p className="share-desc">你也能得到一个</p>
            <p className="share-desc">随机现金红包（2-25元）</p>
            <p className="share-desc">100%中奖噢</p>
            <p className="share-title">爱TA就带TA理财</p>

            <div className="share-confirm-button" onClick={this.clickHandler}>知道了</div>
        </div>)
    }


});

module.exports = SharePanel;