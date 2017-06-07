/**
 * Created by yiran on 2017/5/5.
 */
const $ = window.$ = require('jquery');
const React = require('react');
const OnFire = require('onfire.js');
const project = require('../../Project')

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
            this.setState({isPlaying: true});
        } else {
            this.setState({isPlaying: false});
        }
    },

    // componentDidUpdate() {
    //     OnFire.fire('Course_AutoMove')
    // },


    controlHandler: function() {
        this.props.audioCallBack(this.state.index, this.state.isPlaying);
    },

    PPTComponent(content) {
        if (project === '7days') {
            return(
                <p className={this.state.isPlaying ? 'title-bottom':'title-top'}>{content.title}</p>
            )
        } else if (project === 'fundLesson') {
            return(
                <p className={this.state.isPlaying ? 'title-bottom－fund':'title-top-fund'}><img src={content.title} /></p>
            )
        }
        
    },

    render() {
        let content = this.props.content
        return(
            <div onClick={this.controlHandler} className="audio-title">
                <img className="click-button" src={this.state.isPlaying ? './assets7Intro/image/course/btnPressed.png':'./assets7Intro/image/course/btnPlay.png'}
                />
                {this.PPTComponent(content)}
            </div>
        )
    },

});

module.exports = AudioBar;