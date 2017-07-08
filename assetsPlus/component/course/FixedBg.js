/**
 * Created by yiran on 2017/5/5.
 */
const React = require('react');
const Dimensions = require('../../Dimensions');

const FixedBg = React.createClass({
    getInitialState: function() {
        // console.log('123');
        return {
            content: this.props.content
        };
    },

    componentWillMount() {
        // console.log(Dimensions.getWidthScale());
        // console.log('22222211');
        // console.log(Dimensions);
    },


    handleClick() {
        // this.setState({liked: !this.state.liked});
        location.hash = "/select";
    },
    // style = {fullbg}
    render() {
        console.log('enter bg');
        if(sessionStorage.getItem('courseId') === '1') {
            return(
                <div className="bg-ground" style = {{backgroundImage: 'url("./assetsPlus/image/fund/join-bg.jpg")', width:Dimensions.getWindowWidth(), height: Dimensions.getWindowHeight()}}></div>
            )
        }else if(sessionStorage.getItem('courseId') === '0'){
            return(
                <div className="bg-ground" style = {{backgroundImage: 'url("./assetsPlus/image/seven/bg_1.png")', width:Dimensions.getWindowWidth(), height: Dimensions.getWindowHeight()}}></div>
            )
        } else {
            console.log('push arr ');
            return(<div className="bg-ground" style = {{backgroundColor: '#4498c7', width:Dimensions.getWindowWidth(), height: Dimensions.getWindowHeight()}}></div>
            )
        }
    }
});

module.exports = FixedBg;