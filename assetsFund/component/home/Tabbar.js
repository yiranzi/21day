/**
 * Created by yiran on 2017/5/5.
 */
const React = require('react');

const Tabbar = React.createClass({

    getInitialState: function() {
        return {
            // finishElement: this.props.finishElement,
            // totalElement: this.props.totalElement
            currentIndex: this.props.currentIndex,
            tabs: this.props.tabs,
            // icon: {
            //     onPic: this.props.icons[0],
            //     offPic: this.props.icons[1],
            // }
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
        let tabs = this.state.tabs;
        for (let i = 0; i < tabs.length; i++) {
            let result = 0;
            if(this.state.currentIndex === i){
                result = 1;
            } else {
                result = 0;
            }
            arr.push(<div onClick={this.tabClick.bind(this,i)} className="tabbar-icon">
                    <img src={tabs[i][result]}/>
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
