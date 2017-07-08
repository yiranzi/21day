/**
 * Created by ichangtou on 2017/7/8.
 */


/**
 * Created by yiran on 2017/5/5.
 */
const React = require('react');
const Material = require('../../Material');
const Tools = require('../../GlobalFunc/Tools');

const MineStatus = React.createClass({
    getInitialState: function() {
        // console.log('123');
        return {
            subTitle: ['我的资产','金币交易所','我的优惠券','成就屋']
        };
    },

    componentWillMount() {
        console.log('enter mine');
        // this.getUserInfo();

    },

    // getUserInfo() {
    //     let userId = User.getUserInfo().userId;
    //     Tools.fireRace(userId,"OAUTH_SUCCESS").then(()=>{
    //         Material.getUserAdvanceInfo(userId).done((result)=>{
    //             this.state.userAdvanceInfo = result;
    //             this.setState({userAdvanceInfo: this.state.userAdvanceInfo});
    //         })
    //     });
    // },

    // style = {fullbg}
    render() {
        return(
            <div className="mine-status">
                {this.topInfo()}
                {this.midInfo()}
            </div>
        )
    },

    topInfo() {
        let userAdvanceInfo = this.props.userAdvanceInfo;
        return(<div className="user-info">
            <div className="head-info">
                <img src={userAdvanceInfo.headImage}/>
            </div>
            <div className="base-info">
                <p className="name">{userAdvanceInfo.username}</p>
                {this.renderSex(userAdvanceInfo.sex)}
                <p>金币数：{userAdvanceInfo.gold}</p>
            </div>
        </div>)
    },

    renderSex(type) {
        let arr = [];
        if(type === 0) {
            arr.push(<img className="sex-icon" src={'./assetsFund/image/home/home_female.png'}/>)
        } else {
            arr.push(<img className="sex-icon" src={'./assetsFund/image/home/home_male.png'}/>)
        }
        return arr;
    },

    midInfo() {
       return(<div className="other-info">{this.subInfo()}</div>)
    },

    subInfo() {
        let subTitle = this.state.subTitle;
        let arr = [];
        for (let i = 0; i< subTitle.length; i++) {
            arr.push(
                <div className="subs-out">
                    <div className="sub-inner"></div>
                    <div className="sub-out-border"></div>
                    <span className="sub-title">{subTitle[i]}</span>
                </div>)

        }
        return arr;
    }
});

module.exports = MineStatus;