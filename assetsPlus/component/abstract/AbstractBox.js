/**
 * Created by ichangtou on 2017/8/3.
 */
const React = require('react');


// interface StateTypes {
//
//     index: number,//设置index的接口.(设置了就不会改变的,不应该放在state中)
//          content:内容包
//         status: String,//表示按钮的状态.
//         cbfClick: Function,//点击事件回调接口
//         // cbfHover: Function,
//         // cbfPress: Function,
//         //数据
//         title: String,//可选标题
//         imageOn: String//背景图片
//         imageOff: String//背景图片
//     //样式
//     styleBox: Object,//定义操作相应区域样式(大小)的接口
//         styleClick: Object,
//         styleHover: Object,
//         stylePress: Object,
//         styleDefault: Object,
//styleImage
//
//
// }

const AbstractBox = React.createClass({
    getInitialState: function() {
        // console.log('123');
        return {
            localStatus: 'default',
        };
    },

    // componentWillMount() {
    //     console.log('enter mine');
    //     // this.getUserInfo();
    //
    // },

    render (){

        return(<div style={this.addStyleByStatus()}>
            onClick={this.cbfClick}
            onMouseOver={this.cbfHover}
            onMouseOut = {this.cbfHoverOut}>
            {this.renderContent()}
            {/*<div style = {this.props.styleBox}*/}

            {/*{this.props.title}*/}
            {/*{this.props.children}*/}

            {/*</div>*/}
        </div>)

    },

    renderContent() {
        let title = this.props.title;
        let imageOn = this.props.imageOn;
        let imageOff = this.props.imageOff;
        //有两种图片的布局
        if(imageOn && imageOff) {
            return(<img style = {this.props.styleImage} src={this.props.status === 'click' ? imageOn : imageOff}/>)
        }
    },


    //这部分考虑到复用,就放在底层来写
    addStyleByStatus() {
        let originStyle = this.props.styleDefault;
        let addStyle = {}
        console.log('!!!!!!!')
        if(this.props.status === 'click') {
            addStyle = this.props.styleClick;
        } else {
            //自身判断
            if(this.state.localStatus === 'hover') {
                addStyle = this.props.styleHover;
            }
        }

        return this.addStyle(originStyle, addStyle);
    },

    addStyle(originStyle, addStyle) {
        let copy1 = JSON.parse(JSON.stringify(originStyle));
        for (let style in addStyle) {
            copy1[style] = addStyle[style];
        }
        return copy1;
    },

    cbfHover() {
        let index = this.props.index;
        this.setState({localStatus: 'hover'});
        // this.props.cbfHover(index)
    },

    cbfHoverOut() {
        this.setState({localStatus: 'default'});
        // this.props.cbfHoverOut(index)
    },

    cbfClick() {
        let index = this.props.index;
        let arrayIndex = this.props.arrayIndex;
        this.props.cbfClick(index,arrayIndex);
    },
});

module.exports = AbstractBox;







