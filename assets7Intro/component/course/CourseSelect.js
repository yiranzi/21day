/**
 * Created by yiran on 2017/5/5.
 */
const $ = window.$ = require('jquery');
const React = require('react');
const ReactDom = require('react-dom');
const OnFire = require('onfire.js');


const Link = require('react-router').Link;

const courseSelect = React.createClass({

    // getInitialState(){
    //     return{
    //         playbarWidth: 0
    //     }
    // },


    getInitialState: function() {
        return {
            liked: false,
            dataList: [0,0,1,2,-1,-1,-1]
        };
    },

    componentWillMount() {
        console.log('1.yiran');
        // OnFire.on('PLAY',this.keepgoing);
    },


    handleClick: function(event) {
        this.setState({liked: !this.state.liked});
    },

    render() {
        var text = this.state.liked ? 'like' : 'haven\'t liked';
        return(
            <div className="choice-work">
                <div>
                    <span>123</span>
                    <p onClick={this.handleClick}>
                        You {text} this. Click to toggle.
                    </p>
                    <Link to="/payPage">
                        <p className="check-comment-button">
                            {/*查看{this.state.commentCount}条评论*/}
                            报名页11
                            <img src="./assets/image/player/go.png" className="go-icon"/>
                        </p>
                    </Link>
                </div>
                {this.renderList()}
            </div>
        )
    },

    renderList() {
        let dataList = this.state.dataList;
        if(!dataList || dataList.length == 0 ){
            return null;
        }else{
            let arr = [];
            let count = 0;
            for(let i of dataList) {
                let showUpdateIcon = false;
                if (i.contentUpdate) {
                    showUpdateIcon = !Util.checkOpenedColumnFlag(i.id);
                }
                console.log((20171 + count));
                arr.push(<div className="column-container" key={count}>
                    <Link to={"/course/"+ (20171 + count)}>
                        <span>{20171 + count}</span>
                        {/*<img src={i.cover} className="column-cover"/>*/}
                        {/*<div className="column-info">*/}
                            {/*<div className="info-title-bottom">*/}
                                {/*{showUpdateIcon && <ContentUpdateIcon float="left"/>}*/}
                                {/*<div className="info-title">{i.title}</div>*/}

                            {/*</div>*/}
                            {/*<p className="info-desc">{i.desc}</p>*/}
                        {/*</div>*/}
                    </Link>
                </div>)
                count++;
            }
            // 专辑列表倒叙排列，最新的放在最前面
            arr.reverse();
            return arr;
        }

    }
});

module.exports = courseSelect;