/**
 * Created by yiran on 2017/5/5.
 */
const React = require('react');
const Dimensions = require('../../Dimensions');
const ModalMask = require('../../component/common/ModalMask');

const FixedBg = React.createClass({
    getInitialState: function() {
        // console.log('123');
        return {
            content: this.props.content,

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
        console.log('calc bg');
        let courseId = sessionStorage.getItem('courseId');
        let betaId = GlobalConfig.getBetaInfo().courseId.toString();
        let bgName = 'bg-ground';
        let bgStyle = {
            // backgroundImage: 'url("./assetsPlus/image/fund/join-bg.jpg")',
            width: Dimensions.getWindowWidth(),
            height: Dimensions.getWindowHeight()
        };
        switch(courseId) {
            case '0':
                bgStyle.backgroundImage = 'url("./assetsPlus/image/fund/join-bg.jpg")';
                break;
            case '1':
                bgStyle.backgroundImage = 'url("./assetsPlus/seven/fund/bg_1.png")';
                break;
            case '2':
                bgStyle.backgroundColor = '#FFE69B';
                break;
            case betaId:
                bgStyle.backgroundImage = `url("./assetsPlus/image/${GlobalConfig.getCourseName()}/join-bg.jpg")`;
                break;
            default:
                bgStyle.backgroundColor = '#4498c7';
        }

        // if(sessionStorage.getItem('courseId') === '1') {
        //     return(
        //         <div className="bg-ground" style = {{backgroundImage: 'url("./assetsPlus/image/fund/join-bg.jpg")', width:Dimensions.getWindowWidth(), height: Dimensions.getWindowHeight()}}></div>
        //     )
        // }else if(sessionStorage.getItem('courseId') === '0'){
        //     return(
        //         <div className="bg-ground" style = {{backgroundImage: 'url("./assetsPlus/image/seven/bg_1.png")', width:Dimensions.getWindowWidth(), height: Dimensions.getWindowHeight()}}></div>
        //     )
        // } else if(sessionStorage.getItem('courseId') === '2'){
        //     return(
        //         <div className="bg-ground" style = {{backgroundColor: '#FFE69B', width:Dimensions.getWindowWidth(), height: Dimensions.getWindowHeight()}}></div>
        //     )
        // }else if(sessionStorage.getItem('courseId') === GlobalConfig.getBetaInfo().courseId.toString()){
        //     return(
        //         <div className="bg-ground" style = {{backgroundImage: `url("./assetsPlus/image/${GlobalConfig.getCourseName()}/join-bg.jpg")`, width:Dimensions.getWindowWidth(), height: Dimensions.getWindowHeight()}}></div>
        //     )
        // }else {
        //     return(<div className="bg-ground" style = {{backgroundColor: '#4498c7', width:Dimensions.getWindowWidth(), height: Dimensions.getWindowHeight()}}></div>
        //     )
        // }
        // return(<div>
        //     {this.renderModal()}
        // </div>)
        return(<div className={bgName} style = {bgStyle}>
            {this.renderModal()}
        </div>)
    },
    renderModal() {
        console.log('renderModal');
        let arr = []
        switch (this.props.modalType) {
            case 'null':
                break;
            case 'getExp':
                arr.push(<ModalMask type = {true} cbfClick = {this.props.cbfClick.bind(this,this.props.modalType)} isShow = {true} imageBg = {`./assetsPlus/image/${GlobalConfig.getCourseName()}/paypage_share.png`}/>);
                break;
            case 'levelUp':
                arr.push(<ModalMask type = {true} cbfClick = {this.props.cbfClick.bind(this,this.props.modalType)} isShow = {true} imageBg = {`./assetsPlus/image/${GlobalConfig.getCourseName()}/123.png`}/>);
                break;
            default:
                break;
        }
        return arr;

    }
});

module.exports = FixedBg;