/**
 * Created by yiran on 2017/5/5.
 */
const $ = window.$ = require('jquery');
const React = require('react');
const OnFire = require('onfire.js');
const Project = require('../../Project')

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

    PPTComponent(content, index) {
            const num = ['一', '二', '三', '四', '五', '六', '七', '八', '九']
            return(
                <div>
                    {this.state.isPlaying && <p className={this.state.isPlaying ? 'title-bottom-fund':'title-top-fund'} style={{dispaly:'none'}}>
                        <img src={content.pptUrl} className="title-ppt"/>
                    </p>}
                    {!this.state.isPlaying && <p className={this.state.isPlaying ? 'title-bottom-fund':'title-top-fund'} style={{background: '#545454'}}>
                        <p className="title-play-logo">
                            <img src="./assetsFund/image/course/btnPlayer.png" alt=""/>
                        </p>
                        <p className="title-play-text">
                            <p>
                                <span>第{num[index]}节</span><br/>
                                <span>{content.title}</span>
                            </p>
                        </p>
                    </p>}
                </div>
            )
        
    },

    render() {
        let content = this.props.content
        let index = this.props.audioIndex
        let audioTitleStyle = Project === '7days' ? 'audio-title' : 'audio-title-fund'
        return(
            <div onClick={this.controlHandler} className={audioTitleStyle}>
                {/*<img className="click-button" src={this.state.isPlaying ? './assetsFund/image/course/btnPressed.png':'./assetsFund/image/course/btnPlay.png'}
                />*/}
                {this.PPTComponent(content, index)}
            </div>
        )
    },

});

module.exports = AudioBar;