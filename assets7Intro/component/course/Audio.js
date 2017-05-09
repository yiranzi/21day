/**
 * Created by yiran on 2017/5/5.
 */
const $ = window.$ = require('jquery');
const React = require('react');
const OnFire = require('onfire.js');

const AudioBar = React.createClass({

    // getInitialState(){
    //     return{
    //         playbarWidth: 0
    //     }
    // },


    getInitialState: function() {
        return {
            content: this.props.content,
            index: this.props.audioIndex,
            isPlaying: false,
        };
    },

    componentWillMount() {
        console.log('1.yiran');
    },

    componentWillReceiveProps(nextProps) {
        console.log(nextProps);
        console.log('判断是否正在播放')
        if (this.state.index === nextProps.playingIndex) {
            console.log(nextProps.playingIndex);
            this.setState({isPlaying: true});
        } else {
            console.log(nextProps.playingIndex);
            this.setState({isPlaying: false});
        }
    },


    controlHandler: function() {
        console.log('child click!')
        this.props.audioCallBack(this.state.index, this.state.isPlaying);
    },

    render() {
        let content = this.props.content
        return(
            <div className="control-button-container">
                <span>{this.state.isPlaying}</span>
                <img src={this.state.isPlaying ? './assets/image/player/play.png':'./assets/image/player/pause.png'}
                     className="play-pause-button"
                     onClick={this.controlHandler}
                />
                <p>{content.title}</p>
            </div>
        )
    }
});

module.exports = AudioBar;