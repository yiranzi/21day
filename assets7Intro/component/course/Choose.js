/**
 * Created by yiran on 2017/5/5.
 */
const $ = window.$ = require('jquery');
const React = require('react');
const OnFire = require('onfire.js');

const ChooseBar = React.createClass({

    // getInitialState(){
    //     return{
    //         playbarWidth: 0
    //     }
    // },


    getInitialState: function() {
        return {
            choose: -1
        };
    },

    componentWillMount() {

    },


    handleClick(index) {
        // this.setState({liked: !this.state.liked});
        console.log('click' + index)
        if(index === this.props.question.answer)
        {
            console.log('right');
            this.props.passCallBack();
        }

    },

    render() {
        var question = this.props.question
        return(
        <div className="choose-bar">
            <h2>{question.title}</h2>
            {this.OptionRender(question)}
        </div>
        )
    },

    OptionRender (question) {
        console.log('choose render')
        let arr=[];
        let count = 0
        for (let item of question.content) {
            arr.push( <div className="choose-options" key={count}>
                <p onClick={this.handleClick.bind(this, count)}>{item}</p>
            </div>)
            count++;
        }
        return arr;
    }
});

module.exports = ChooseBar;