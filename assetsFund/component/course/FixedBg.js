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
        if(sessionStorage.getItem('courseId') === '1') {
            return(
                <div className="bg-ground" style = {{backgroundImage: 'url("./assetsFund/image/fund/join-bg.jpg")', width:Dimensions.getWindowWidth(), height: Dimensions.getWindowHeight()}}></div>
            )
        }else {
            return(
                <div className="bg-ground" style = {{backgroundImage: 'url("./assetsFund/image/seven/bg_1.png")', width:Dimensions.getWindowWidth(), height: Dimensions.getWindowHeight()}}></div>
            )
        }

    }
});

module.exports = FixedBg;