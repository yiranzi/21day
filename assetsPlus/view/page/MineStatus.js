/**
 * Created by ichangtou on 2017/7/8.
 */


/**
 * Created by yiran on 2017/5/5.
 */
const React = require('react');
const Material = require('../../Material');
const Tools = require('../../GlobalFunc/Tools');
const ProcessBarContain = require('../../component/Complex/ProcessBar/ProcessBarContain');

const MineStatus = React.createClass({
    getInitialState: function() {
        // console.log('123');
        return {
            subTitle: ['我的资产','金币交易所','我的优惠券','成就屋'],
            localExpInfo: {
            },
            currentExp: 20,
            kValue: 1,
            dTime: 0,
        };
    },

    componentWillMount() {
        MyStorage.whenEnterPage('homeinfo');
        //下拉经验值
        // this.initExp();

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

    


    //渲染前计算
    calcExp() {
        this.state.kValue = this.state.localExpInfo.current/this.state.localExpInfo.max;
        return this.state.kValue;
        // this.setState({
        //     kValue: this.state.kValue,
        // });

    },

    //这种在渲染循环里的东西很容易造成bug
    //设置父组件会让子组件再次渲染.会再次调用父组件
    calcLevelUp() {
        if(this.state.localExpInfo.levelUp) {
            setTimeout(()=>{
                this.props.cbfModalChange('levelUp');
                console.log('level up')
            },this.state.dTime * 1100)
        } else {
            setTimeout(()=>{
                console.log('up finish')
            },this.state.dTime * 1100)
        }
    },

    //渲染变化时间
    calcDTime() {
        console.log('calcDTime');
        if(this.state.localExpInfo.level > -1) {
            let distance = this.props.userExpInfo.current - this.state.localExpInfo.current;
            //速度 = 长度/时间
            let v = this.state.localExpInfo.max/2;
            this.state.dTime = distance/v;
            this.state.localExpInfo = JSON.parse(JSON.stringify(this.props.userExpInfo));
            return this.state.dTime;
            // this.setState({dTime: this.state.dTime});
            // this.setState({localExpInfo: this.state.localExpInfo});
        } else {
            this.state.localExpInfo = JSON.parse(JSON.stringify(this.props.userExpInfo));
            // this.setState({dTime: 0,
            //     localExpInfo: this.state.localExpInfo})
            return 0
        }


    },



    // style = {fullbg}
    render() {
        return(
            <div className="mine-status">
                {this.renderSignUp()}
                {this.renderExpProcess()}
                {this.topInfo()}
                {this.midInfo()}
            </div>
        )
    },

    renderSignUp() {
        return(<div onClick = {this.signUp}>签到加经验</div>)
    },

    signUp() {
        console.log('click');
        GlobalExp.expUpEvent('signUp').then(()=>{
            //1弹出获取经验弹窗
            this.props.cbfModalChange('getExp');
        }, ()=>{alert('失败');})
    },

    calcRenderExp() {
        this.calcDTime();
        this.calcExp();
        this.calcLevelUp();
    },

    renderExpProcess() {
        this.calcRenderExp();
        return(<div>
            <span>{this.state.localExpInfo.level}</span>
            <ProcessBarContain kValue = {this.state.kValue}
                               dTime = {this.state.dTime}/>

        </div>);
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
            arr.push(<img className="sex-icon" src={'./assetsPlus/image/home/home_female.png'}/>)
        } else {
            arr.push(<img className="sex-icon" src={'./assetsPlus/image/home/home_male.png'}/>)
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
                <div onClick = {this.subClick.bind(this,i)}className="subs-out">
                    <div className="sub-inner"></div>
                    <div className="sub-out-border"></div>
                    <span className="sub-title">{subTitle[i]}</span>
                </div>)

        }
        return arr;
    },

    subClick(index) {
        Statistics.postDplusData('点击_内容_导航栏',[index]);
        // window.dialogAlertComp.show('即将开启','新鲜的内容正在精心准备中，敬请期待！','知道啦',()=>{},'',false);
    }
});

module.exports = MineStatus;