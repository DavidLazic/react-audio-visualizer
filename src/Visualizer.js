import React, { PropTypes } from 'react';

const OPTIONS_ANALYSER = {
    smoothingTime: 0.6,
    fftSize: 512
};

const OPTIONS_DEFAULT = {
    autoplay: false,
    loop: false,
    shadowBlur: 20,
    shadowColor: '#ffffff',
    barColor: '#cafdff',
    barWidth: 2,
    barHeight: 2,
    barSpacing: 7,
    font: ['12px', 'Helvetica'],
    style: 'lounge'
};

const Visualizer = React.createClass({
    requestAnimationFrame: null,
    ctx: null,
    analyser: null,
    frequencyData: 0,
    sourceNode: null,
    gradient: null,
    canvasCtx: null,
    interval: null,
    duration: null,
    minutes: '00',
    seconds: '00',
    options: OPTIONS_DEFAULT,
    styleTypes: {
        lounge: '_renderLounge'
    },

    getInitialState () {
        return {
            playing: false
        };
    },

    componentWillMount () {
        this._extend()
            .then(() => {
                this._setContext();
            }).then(() => {
                this._setAnalyser();
            }).then(() => {
                this._setFrequencyData();
            }).then(() => {
                this._setBufferSourceNode();
            }).then(() => {
                this._setRequestionAnimationFrame();
            }).catch((error) => {
                this._displayError(error);
            });
    },

    componentDidMount () {
        this._setCanvasContext()
            .then(() => {
                this._setCanvasStyles();
            }).then(() => {
                this.options.autoplay && this._resolvePlayState();
            }).catch((error) => {
                this._displayError(error);
            });
    },

    /**
     * @description
     * Display visualizer error.
     *
     * @param {Object} error
     * @return {Function}
     * @private
     */
    _displayError (error) {
        return window.console.error(error);
    },

    /**
     * @description
     * Extend constructor options.
     *
     * @return {Object}
     * @private
     */
    _extend () {
        return new Promise((resolve, reject) => {
            Object.assign(this.options, this.props.options);
            return resolve();
        });
    },

    /**
     * @description
     * Set canvas context.
     *
     * @return {Object}
     * @private
     */
    _setCanvasContext () {
        const canvasCtx = this.refs.canvas.getContext('2d');

        return new Promise((resolve, reject) => {
            Object.assign(this, { canvasCtx });
            return resolve();
        });
    },

    /**
     * @description
     * Set audio context.
     *
     * @return {Object}
     * @private
     */
    _setContext () {
        const error = { message: 'Web Audio API is not supported.' };

        return new Promise((resolve, reject) => {
            try {
                window.AudioContext = window.AudioContext || window.webkitAudioContext;
                Object.assign(this, { ctx: new window.AudioContext() });
                return resolve();
            } catch (e) {
                return reject(error);
            }
        });
    },

    /**
     * @description
     * Set audio buffer analyser.
     *
     * @return {Object}
     * @private
     */
    _setAnalyser () {
        const { ctx } = this;

        return new Promise((resolve, reject) => {
            let analyser = ctx.createAnalyser();

            analyser.smoothingTimeConstant = OPTIONS_ANALYSER.smoothingTime;
            analyser.fftSize = OPTIONS_ANALYSER.fftSize;

            Object.assign(this, { analyser });
            return resolve();
        });
    },

    /**
     * @description
     * Set frequency data.
     *
     * @return {Object}
     * @private
     */
    _setFrequencyData () {
        const { analyser } = this;

        return new Promise((resolve, reject) => {
            const frequencyData = new Uint8Array(analyser.frequencyBinCount);

            Object.assign(this, { frequencyData })
            return resolve();
        });
    },

    /**
     * @description
     * Set source buffer and connect processor and analyser.
     *
     * @return {Object}
     * @private
     */
    _setBufferSourceNode () {
        const { ctx, analyser } = this;
        const { loop } = this.options;

        return new Promise((resolve, reject) => {
            let sourceNode = ctx.createBufferSource();

            Object.assign(sourceNode, { loop });
            sourceNode.connect(analyser);
            sourceNode.connect(ctx.destination);
            sourceNode.onended = () => {
                this.setState({ playing: false }, () => {
                    clearInterval(this.interval);
                    this.sourceNode.disconnect();
                    this.resetTimer();
                    this.sourceNode = ctx.createBufferSource();
                });
            };

            Object.assign(this, { sourceNode });
            return resolve();
        });
    },

    /**
     * @description
     * Set request animation frame fn.
     *
     * @return {Object}
     * @private
     */
    _setRequestionAnimationFrame () {
        return new Promise((resolve, reject) => {
            this.requestAnimationFrame = (() => {
        	  return  window.requestAnimationFrame ||
        	          window.webkitRequestAnimationFrame ||
        	          window.mozRequestAnimationFrame ||
        	          function (callback) {
        	            window.setTimeout(callback, 1000 / 60);
        	          };
        	})();

            return resolve();
        });
    },

    /**
     * @description
     * Set canvas gradient color.
     *
     * @return {Object}
     * @private
     */
    _setCanvasStyles () {
        const { canvasCtx } = this;
        const { barColor, shadowBlur, shadowColor, font } = this.options;

        let gradient = canvasCtx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(1, barColor);

        const canvasStyle = {
            fillStyle: gradient,
            shadowBlur: shadowBlur,
            shadowColor: shadowColor,
            font: font.join(' '),
            textAlign: 'center'
        };

        Object.assign(this, { gradient });
        Object.assign(this.canvasCtx, canvasStyle);
    },

    /**
     * @description
     * Resolve play state.
     *
     * @return {Function}
     * @private
     */
    _resolvePlayState () {
        const { ctx } = this;

        if (!this.state.playing) {
            return (ctx.state === 'suspended') ?
                this._audioPlay() :
                this._audioLoad();
        } else {
            return this._audioPause();
        }
    },

    /**
     * @description
     * Load audio file fn.
     *
     * @return {Object}
     * @private
     */
    _audioLoad () {
        const { ctx } = this;
        const { model } = this.props;
        const { canvas } = this.refs;

        this.canvasCtx.fillText('Loading...', canvas.width / 2, canvas.height / 2);

        let req = new XMLHttpRequest();
        req.open('GET', model.path, true);
        req.responseType = 'arraybuffer';

        req.onload = () => {
            ctx.decodeAudioData(req.response, (buffer) => {
                this._audioPlay(buffer);
            }, (error) => {
                this._displayError(error);
            });
        };

        req.send();
        return this;
    },

    /**
     * @description
     * Audio pause fn.
     *
     * @return {Object}
     * @private
     */
    _audioPause () {
        this.setState({ playing: false }, () => {
            this.ctx.suspend();
        });

        return this;
    },

    /**
     * @description
     * Audio play fn.
     *
     * @return {Object}
     * @private
     */
    _audioPlay (buffer) {
        const { ctx, sourceNode } = this;

        this.setState({ playing: true }, () => {
            if (ctx.state === 'suspended') {
                return ctx.resume();
            }

            sourceNode.buffer = buffer;
            sourceNode.start(0);
            this
                ._resetTimer()
                ._startTimer()
                ._renderFrame();
        });

        return this;
    },

    /**
     * @description
     * Reset audio timer fn.
     *
     * @return {Object}
     * @private
     */
    _resetTimer () {
        Object.assign(this, { duration: (new Date(0, 0)).getTime() });
        return this;
    },

    /**
     * @description
     * Start audio timer fn.
     *
     * @return {Object}
     * @private
     */
    _startTimer () {
        this.interval = setInterval(() => {
            if (this.state.playing) {
                let now = new Date(this.duration);
                let min = now.getHours();
                let sec = now.getMinutes();

                Object.assign(this, {
                    minutes: (min < 10) ? '0' + min : min,
                    seconds: (sec < 10) ? '0' + sec : sec,
                    duration: now.setMinutes(sec + 1)
                });
            }
        }, 1000);
        return this;
    },

    /**
     * @description
     * Render canvas frame.
     *
     * @return {Object}
     * @private
     */
    _renderFrame () {
        const { analyser, frequencyData, canvasCtx, requestAnimationFrame } = this;
        const { canvas } = this.refs;

        requestAnimationFrame(this._renderFrame);
        analyser.getByteFrequencyData(frequencyData);

        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

        this._renderTime()
            ._renderText()
            ._renderByStyleType();

        return this;
    },

    /**
     * @description
     * Render audio time fn.
     *
     * @return {Object}
     * @private
     */
    _renderTime () {
        const { canvasCtx } = this;
        const { canvas } = this.refs;

        let time = `${this.minutes}:${this.seconds}`;
        canvasCtx.fillText(time, canvas.width / 2 + 10, canvas.height / 2 + 40);
        return this;
    },

    /**
     * @description
     * Render audio author and title fn.
     *
     * @return {Object}
     * @private
     */
    _renderText () {
        const { canvasCtx } = this;
        const { canvas } = this.refs;
        const { model } = this.props;
        const { font } = this.options;

        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const fontAdjustment = 6;
        const alignAdjustment = 8;

        canvasCtx.textBaseline = 'top';
        canvasCtx.fillText('by ' + model.author, cx + alignAdjustment, cy);
        canvasCtx.font = parseInt(font[0], 10) + fontAdjustment + 'px ' + font[1];
        canvasCtx.textBaseline = 'bottom';
        canvasCtx.fillText(model.title, cx + alignAdjustment, cy);
        canvasCtx.font = font.join(' ');

        return this;
    },

    /**
     * @description
     * Render frame by style type.
     *
     * @return {Function}
     * @private
     */
    _renderByStyleType () {
        const { styleTypes } = this;
        const { style } = this.options;

        return styleTypes[style] && this[styleTypes[style]].call(this, null);
    },

    /**
     * @description
     * Render lounge style type.
     * Default rendering style.
     *
     * @return {Object}
     * @private
     */
    _renderLounge () {
        const { frequencyData, canvasCtx } = this;
        const { canvas } = this.refs;
        const { barWidth, barHeight, barSpacing } = this.options;

        const radiusReduction = 70;
        const amplitudeReduction = 6

        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const radius = Math.min(cx, cy) - radiusReduction;
        const maxBarNum = Math.floor((radius * 2 * Math.PI) / (barWidth + barSpacing));
        const slicedPercent = Math.floor((maxBarNum * 25) / 100);
        const barNum = maxBarNum - slicedPercent;
        const freqJump = Math.floor(frequencyData.length / maxBarNum);

        for (let i = 0; i < barNum; i++) {
            const amplitude = frequencyData[i * freqJump];
            const theta = (i * 2 * Math.PI ) / maxBarNum;
            const delta = (3 * 45 - barWidth) * Math.PI / 180;
            const x = 0;
            const y = radius - (amplitude / 12 - barHeight);
            const w = barWidth;
            const h = amplitude / amplitudeReduction + barHeight;

            canvasCtx.save();
            canvasCtx.translate(cx + barSpacing, cy + barSpacing);
            canvasCtx.rotate(theta - delta);
            canvasCtx.fillRect(x, y, w, h);
            canvasCtx.restore();
        }

        return this;
    },

    /**
     * @return {Object}
     * @public
     */
    render () {
        const { model, width, height } = this.props;

        return (
            <div className="visualizer" onClick={ this._resolvePlayState }>
                <audio
                    className="visualizer__audio"
                    src={ model.path }
                    data-author={ model.author }
                    data-title={ model.title }>
                </audio>

                <div className="visualizer__canvas-wrapper">
                    <canvas
                        ref="canvas"
                        className="visualizer__canvas"
                        width={ width }
                        height={ height }>
                    </canvas>
                </div>
            </div>
        );
    }
});

Visualizer.PropTypes = {
    model: PropTypes.object.isRequired,
    options: PropTypes.object,
    width: PropTypes.string,
    height: PropTypes.string
};

export default Visualizer;
