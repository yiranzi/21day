/**
 * Created by yiran on 2017/5/5.
 */
const $ = window.$ = require('jquery');
const React = require('react');
const ReactDom = require('react-dom');
const OnFire = require('onfire.js');


const Link = require('react-router').Link;
const LessonBar = require('./LessonBar');

const courseSelect = React.createClass({

    // getInitialState(){
    //     return{
    //         playbarWidth: 0
    //     }

    getInitialState: function() {
        return {
            liked: false,
            dataList: [1,1,0,2,2,0,0],
            courseList: {},
        };
    },

    componentWillMount() {
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
        console.log('push ajax')

        if (User.getUserInfo().userId) {
            this.getCourseList();
        } else {
            OnFire.on('OAUTH_SUCCESS', ()=>{
                this.getCourseList();
            })
        }
    },


    handleClick: function(event) {
        this.setState({liked: !this.state.liked});
    },

    getCourseList () {
        Material.getCourseList().always( (data) => {
            console.log('get ajax',data)
            this.setState({courseList: data})
        })
    },

    render() {
        var text = this.state.liked ? 'like' : 'haven\'t liked';
        return(
            <div className="course-select">
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
                {this.renderCourseList()}

            </div>
        )
    },

    renderCourseList() {
        console.log('render list')
        let courseList = this.state.courseList;
        let arr = []
        if(!courseList || courseList.length === 0 ){
            return null;
        } else {
            for (let i = 0; i < courseList.length; i++) {
                arr.push(
                    <Link key={i} to={{pathname:"/course/"+ (i + 1), query:{name: courseList[i].status}}}>
                        <LessonBar content = {courseList[i]} ></LessonBar>
                    </Link>
                    )
            }
            return arr
        }
    },


    renderList() {
        let dataList = this.state.dataList;
        console.log(this.state.dataList);
        if(!dataList || dataList.length === 0 ){
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

module.exports = courseSelect;