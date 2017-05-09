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

    componentWillReceiveProps() {
        console.log('change');
        this.ifThisPlaying();
    },


    controlHandler: function() {
        this.state.isPlaying = !this.state.isPlaying
        if (this.state.isPlaying)
        {
            console.log('开始播放')
            //TODO  播放
        } else {
            console.log('暂停')
            //TODO  暂停
        }
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
    },

    ifThisPlaying() {
        console.log('判断是否正在播放')
        if (this.state.index === this.props.playingIndex) {
            this.setState({isPlaying: true});
        } else {
            this.setState({isPlaying: false});
        }
    }
});

module.exports = AudioBar;