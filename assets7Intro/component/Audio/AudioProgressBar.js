/**
 * Created by Administrator on 17-3-1.
 */
const $ = window.$ = require('jquery');
const React = require('react');
const ReactDom = require('react-dom');
const OnFire = require('onfire.js');
const Draggable = require('react-draggable');


const AudioProgressBar = React.createClass({

    getInitialState(){
        return{
            playbarWidth: 0
        }
    },

    componentWillMount() {
        //console.log('AudioProgressBar');
        OnFire.on('PLAY',this.keepgoing);
    },
    

    /**
     * 点击进度条
     * @param e
     */
    progressClickHandler: function progressClickHandler(e) {
        let audio = $('#globalAudio')[0];
        //console.log('onclick');
        let x = e.nativeEvent.pageX,
            newCurrentTime = audio.duration * (x / window.innerWidth);

        audio.currentTime = newCurrentTime;
    },

    /**
     * 格式化时间
     * @param time
     * @returns {string}
     */
    formatTime(time,position) {

        if(time){
            let minute = Math.floor(time / 60);
            minute = minute < 10 ? '0' + minute : minute;

            let second = Math.round(time%60);
            second = second < 10 ? '0' + second : second;

            return minute + ':' + second;

        }else{
            if(position){
                return '05:00'
            }else{
                return '00:00'
            }
        }
    },


    keepgoing(currentTime){
        let audio = $('#globalAudio')[0];

        if(!currentTime){
            currentTime = audio.currentTime;
        }

        //标记播放进度
        if( audio && audio.duration ) {

            if(currentTime / audio.duration * 100 >95){
                return
            }

            this.setState({
                playbarWidth : currentTime / audio.duration * 100 + '%'
            })
        }
    },


    /**
     * 拖拽
     * @param ev
     */
    dragTargetHandler(ev) {
        //console.log('dragTargetHandler',ev)

        let audio = $('#globalAudio')[0];
        let x = ev.changedTouches[0].pageX;
        let newCurrentTime = audio.duration * ( x/ window.innerWidth );



        if(newCurrentTime > audio.duration){
            newCurrentTime = audio.duration;
        }else if(newCurrentTime <= 0){
            newCurrentTime = 0;
        }

        //console.log('newCurrentTime',newCurrentTime);

        audio.currentTime = newCurrentTime;


        this.keepgoing(newCurrentTime);

    },


    /**
     * 停下拖拽
     * @param ev
     */
    dropOverProgressHandler(ev) {
        //console.log('dropOverProgressHandler',ev,ev.changedTouches[0].pageX)
        let audio = $('#globalAudio')[0];
        let newCurrentTime = audio.duration * (ev.changedTouches[0].pageX / window.innerWidth );

        if(newCurrentTime > audio.duration){
            newCurrentTime = audio.duration;

        }else if(newCurrentTime <= 0){
            newCurrentTime = 0;
        }

        //console.log('newCurrentTime',newCurrentTime);

        audio.currentTime = newCurrentTime;
        //console.log('audio.currentTime',audio.currentTime);

        this.keepgoing(newCurrentTime);
    },

    render() {
        let audio = $('#globalAudio')[0];
        return(
            <div className="audio-progress-bar">
                <div className={this.state.isPlaying ? 'is-playing' : 'is-paused'}>
                    <div className="process-panel" onClick={this.progressClickHandler}>
                        <span className="time player_position">{audio && this.formatTime(audio.currentTime,0)}</span>
                        <span className="time duration">{audio && this.formatTime(audio.duration,1)}</span>
                        <div className="progressbar player_progressbar" onClick={this.progressClickHandler}>
                            <div className="seekbar player_seekbar" style={{width: '100%'}}></div>

                            <div className="moving-bar" style={{width:"100%",maxWidth:"100%"}}>
                                <div className="playbar player_playbar" style={{width: this.state.playbarWidth,maxWidth:"100%"}}></div>
                                {
                                    <Draggable
                                        axis="x"  bounds="parent"
                                        onStart={this.dragTargetHandler}
                                        onDrag={this.dragTargetHandler}
                                        onStop={this.dropOverProgressHandler}>
                                        <div className="moving-ball" style={{transform:' translate(0, 0)'}}></div>
                                    </Draggable>
                                }

                            </div>
                        </div>
                    </div>
                </div>
            </div>

        )
    }
});

module.exports = AudioProgressBar;