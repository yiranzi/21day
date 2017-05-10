/**
 * Created by yiran on 2017/5/5.
 */
const $ = window.$ = require('jquery');
const React = require('react');
const ReactDom = require('react-dom');
const OnFire = require('onfire.js');
const User = require('../../User');
const Config = require('../../Config');
const Link = require('react-router').Link;

const CourseSelect = React.createClass({

    // getInitialState(){
    //     return{
    //         playbarWidth: 0
    //     }

    getInitialState: function() {
        return {
            liked: false,
            dataList: [1,1,0,2,2,0,0],
            type: [
                '未解锁',
                '新的!未听!',
                '没听完',
                '已完成'
            ]
        };
    },

    componentWillMount() {
      // TODO roy 判断用户当前的购买状态，未购买则直接跳转到支付页面
      // 购买后留在关卡页面
      let userId = User.getUserInfo().userId;
      console.log("===userId = " + userId);
      if (userId) {
        this.checkUserPayStatue();
      } else {
        OnFire.on(Config.OAUTH_SUCCESS, ()=>{
          console.log("===OAUTH_SUCCESS");

          this.checkUserPayStatue();
        });
      }

        console.log('1.yiran12');
        if (!this.counter) {
            this.counter = 0;
        }
        this.counter = this.counter + 1
        //TODO 接收完成课程.缺少参数.1
        // OnFire.on('Pass_Lesson',this.keepgoing);
        //
        OnFire.on('Pass_Lesson', (index)=>{
            console.log('接收到作业通过的回调');
            this.state.dataList[index] = 3;
            let localData = this.state.dataList;
            console.log(this.state.dataList);
            // this.setState({dataList: localData});
        })
    },

    /**
    * 检查用户购买状态
    */
    checkUserPayStatue() {
      Material.getJudgeFromServer().done((result)=>{
          Loading.hideLoading();
          console.log("是否购买：", result);
          if(result){
              console.log('购买过');

          } else{ // 未购买直接跳到购买页面
              location.hash = "/payPage";
          }
      }).fail(()=>{

      });
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
        console.log(this.state.dataList);
        if(!dataList || dataList.length == 0 ){
            return null;
        }else{
            let arr = [];
            let count = 0;
            for(let i of dataList) {
                console.log((20171 + count));
                arr.push(<div className="column-container" key={count}>
                    <Link to={{pathname:"/course/"+ (20171 + count),query:{name: i}}}>
                        <span>{20171 + count}</span>
                        <span>{this.state.type[i]}</span>
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

module.exports = CourseSelect;
