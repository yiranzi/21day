/**
 * Created by ichangtou on 2017/7/11.
 */
/**
 * Created by ichangtou on 2017/7/8.
 */

const React = require('react');
const Material = require('../../Material');
const Tools = require('../../GlobalFunc/Tools');

const messageBoard = React.createClass({
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
            <div className="message-board">
                <div className="title">
                    <img src={this.props.titleImg}/>
                </div>
                <div className="list">
                    {this.renderList()}
                </div>
            </div>
        )
    },

    renderList() {
        let arr = []
        //多少页
        for (let i = 0; i < this.props.userLists.length; i++) {
            let messagePage = this.props.userLists[i];
            for (let i = 0; i < messagePage.length; i++) {
                let userMessage = messagePage[i];
                arr.push(this.renderLine(userMessage))
            }
        }
        return arr;
    },

    renderLine(userMessage) {
        return(<div className="user-message">
            <img className="head-image" src={userMessage.image}/>
            <div className="user-info">
                <p className="name">userMessage.userName</p>
                <p className="data">userMessage.create_time</p>
                <p className="message">userMessage.content</p>
            </div>
            <img className="like" src=""/>
        </div>)
    }

});

module.exports = messageBoard;