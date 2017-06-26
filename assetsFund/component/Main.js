/**
 *
 * Created by doudou on 16-8-2.
 */

var React = require('react');

var PayPage = require('./PayPage');

var Main = React.createClass({
    getInitialState() {
        return {

        };
    },

    componentWillMount() {

    },

    render() {
        return (
            <div className="main-container">
                <PayPage/>
        </div>);
    }

});

module.exports = Main;