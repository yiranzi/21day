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
        if (this.state.index === this.props.playingIndex) {
            this.setState({isPlaying: true});
        } else {
            this.setState({isPlaying: false});
        }
    },

    componentWillReceiveProps(nextProps) {
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
            <div onClick={this.controlHandler} className="audio-title">
                <img className="click-button" src={this.state.isPlaying ? './assets/image/course/btnPlay.png':'./assets/image/course/btnPressed.png'}
                />
                <p className={this.state.isPlaying ? 'title-top':'title-bottom'}>{content.title}</p>
            </div>
        )
    }
});

module.exports = AudioBar;