/**
 * Created by yiran.
 */
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var hashHistory =  require('react-router').hashHistory;
const IndexRedirect = require('react-router').IndexRedirect;
var React = require('react');
var App = require('./component/App');
// const FMView = require('./component/FMView');

// const PayPage = require('./component/PayPage');
// const CourseSelect = require('./component/course/CourseSelect');
// const ListenCourse = require('./component/course/ListenCourse');
const GetReward = require('./component/course/GetReword');
const GetGraduated = require('./component/course/GetGraduated');


const PayPageFund = require('./view/fund/PayPage');
const CourseSelectFund = require('./view/fund/CourseSelect');
const ListenCourseFund = require('./view/fund/ListenCourse');
const GetRewardFund = require('./view/fund/GetReword');
const GetGraduatedFund = require('./view/fund/GetGraduated');


const PayPageSeven = require('./view/seven/PayPage');
const CourseSelectSeven = require('./view/seven/CourseSelect');
const ListenCourseSeven = require('./view/seven/ListenCourse');
const GetRewardSeven = require('./view/seven/GetReword');
const GetGraduatedSeven = require('./view/seven/GetGraduated');





const CPlusMain = require('./view/CPlusMain');

let InnerRouter = React.createClass({
    render(){
        return (
            <Router history={hashHistory}>
                <Route path="/" component={App}>
                    {/*<IndexRedirect to="/FMView"/>*/}
                    <IndexRedirect to={this.props.goWhere}/>
                    <Route path ="/fund/payPage" component={PayPageFund}/>
                    <Route path ="/fund/courseSelect" component={CourseSelectFund}/>
                    <Route path ="/fund/listenCourse" component={ListenCourseFund}/>

                    <Route path ="/seven/payPage" component={PayPageSeven}/>
                    <Route path ="/seven/courseSelect" component={CourseSelectSeven}/>


                    <Route path="/main" component={CPlusMain}/>
                    {/*<Route path="/payPage(/:free)" component={PayPage}/>*/}
                    {/*<Route path="/select" component={CourseSelect}/>*/}
                    {/*<Route path="/course/:courseId(/:free)" component={ListenCourse}/>*/}
                    {/*用于标识是自己在听课*/}
                    <Route path="/getReward/:courseId(/:mine)" component={GetReward}/>
                    <Route path="/getGraduated(/:mine)" component={GetGraduated}/>
                    {/*<Route path="/FMView" component={FMView}/>*/}
                </Route>
            </Router>
        )
    }
});

module.exports = InnerRouter;
