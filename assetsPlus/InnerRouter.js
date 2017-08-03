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
// const GetReward = require('./component/course/GetReword');
// const GetGraduated = require('./component/course/GetGraduated');


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


const PayPage21 = require('./view/course21/PayPage');
const CourseBegin21 = require('./view/course21/CourseBegin');
const CourseSelect21 = require('./view/course21/CourseSelect');
const ListenCourse21 = require('./view/course21/ListenCourse');





const CPlusMain = require('./view/CPlusMain');

let InnerRouter = React.createClass({
    render(){
        // let routerInfo = GlobalConfig.getRouterInfo();
        return (
            <Router history={hashHistory}>
                <Route path="/" component={App}>
                    {/*<IndexRedirect to="/FMView"/>*/}
                    {/*共有*/}
                    <IndexRedirect to={this.props.goWhere}/>
                    <Route path="/main" component={CPlusMain}/>
                    {/*基金课*/}
                    {/*<Route path =  {`/${routerInfo['1']}/${routerInfo['pay']}`} component={PayPageFund}/>*/}
                    {/*<Route path =  {`/${routerInfo['1']}/${routerInfo['select']}`} component={CourseSelectFund}/>*/}
                    {/*<Route path =  {`/${routerInfo['1']}/${routerInfo['listen']}/:dayId`} component={ListenCourseFund}/>*/}
                    {/*<Route path =  {`/${routerInfo['1']}/${routerInfo['reward1']}(/:mine)`} component={GetRewardFund}/>*/}
                    {/*<Route path =  {`/${routerInfo['1']}/${routerInfo['reward2']}(/:mine)`} component={GetGraduatedFund}/>*/}
                    {/*七天*/}
                    <Route path ="/seven/payPage" component={PayPageSeven}/>
                    <Route path ="/seven/courseSelect" component={CourseSelectSeven}/>
                    <Route path ="/seven/listenCourse/:dayId" component={ListenCourseSeven}/>
                    <Route path="/seven/getReward/:dayId(/:mine)" component={GetRewardSeven}/>
                    <Route path="/seven/getGraduated(/:mine)" component={GetGraduatedSeven}/>
                    {/*21天*/}
                    <Route path="/course21/payPage" component={PayPage21}/>
                    <Route path="/course21/courseBegin/:type" component={CourseBegin21}/>
                    <Route path="/course21/courseSelect" component={CourseSelect21}/>
                    <Route path="/course21/listenCourse/:dayId" component={ListenCourse21}/>

                    <Route path = {`/${ GlobalConfig.getRouterInfo(2)}/${ GlobalConfig.getRouterInfo('pay')}`} component={PayPage21}/>
                    <Route path = {`/${ GlobalConfig.getRouterInfo(2)}/${ GlobalConfig.getRouterInfo('begin')}/:type`} component={CourseBegin21}/>
                    <Route path = {`/${ GlobalConfig.getRouterInfo(2)}/${ GlobalConfig.getRouterInfo('select')}`} component={CourseSelect21}/>
                    <Route path = {`/${ GlobalConfig.getRouterInfo(2)}/${ GlobalConfig.getRouterInfo('listen')}/:dayId`} component={ListenCourse21}/>


                    {/*<Route path="/payPage(/:free)" component={PayPage}/>*/}
                    {/*<Route path="/select" component={CourseSelect}/>*/}
                    {/*<Route path="/course/:courseId(/:free)" component={ListenCourse}/>*/}
                    {/*用于标识是自己在听课*/}
                    {/*<Route path="/getReward/:courseId(/:mine)" component={GetReward}/>*/}
                    {/*<Route path="/getGraduated(/:mine)" component={GetGraduated}/>*/}
                    {/*<Route path="/FMView" component={FMView}/>*/}
                </Route>
            </Router>
        )
    }
});

module.exports = InnerRouter;
