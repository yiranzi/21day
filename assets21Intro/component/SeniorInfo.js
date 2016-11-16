/**
 * Created by Administrator on 16-11-15.
 */
var $ = require('jquery');
var React = require('react');
var ReactDom = require('react-dom');

var User = require('../User');
var OnFire = require('onfire.js');
var Material = require('../Material');

var SeniorInfo = React.createClass({

    getInitialState() {
        return {
            seniorImg: './assets21Intro/image/logo.png',
            seniorName: '你的小伙伴'
        }
    },

    componentWillMount() {

        let seniorId = Util.getUrlPara('ictchannel');

        seniorId && Material.getSeniorInfoFromServer(seniorId)
        .done((data)=> {
            console.log('data',data);
            this.setState({
                seniorImg: data.portrait||'./assets21Intro/image/logo.png',
                seniorName: data.nickName
            });
        })
    },



    render() {
        return (<div className="senior-info-view">
            <div className="senior-image-box">
                <span className="img-border"/>
                <img src={this.state.seniorImg} className="senior-image"/>
                <span className="img-border"/>
            </div>

            <p className="senior-name">{this.state.seniorName}</p>

            <div className="coupon-box">
                <div className="coupon-info">
                    <p className="coupon-text">你的好友{this.state.seniorName}邀请你来</p>
                    <p className="coupon-text">21天理财小白训练营一起学习</p>
                </div>
            </div>

            <p className="slogan">理财，就是理生活</p>
        </div>)
    }
});

module.exports = SeniorInfo;