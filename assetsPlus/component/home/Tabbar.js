/**
 * Created by yiran on 2017/5/5.
 */
const React = require('react');

const Tabbar = React.createClass({

    getInitialState: function() {
        return {
        };
    },

    componentWillMount() {

    },


    render() {
        return(
            <div className="tabbar">
                {this.renderIcons()}
            </div>
        )
    },

    renderIcons() {
        let arr =[];
        let tabs = this.props.tabs;
        for (let i = 0; i < tabs.length; i++) {
            let result = 0;
            if(this.props.currentIndex === i){
                result = 1;
            } else {
                result = 0;
            }
            arr.push(<div onClick={this.tabClick.bind(this,i)} className="tabbar-icon">
                    <img className="icon" src={tabs[i][result]}/>
                </div>)
        }
        return arr;
    },

   tabClick(index) {
       console.log('staet render icons');
        this.props.cbfTabClick(index);
    }
});

module.exports = Tabbar;
