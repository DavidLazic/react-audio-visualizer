require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"react-audio-visualizer":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var STATES = ['ENDED', 'PLAYING', 'PAUSED', 'BUFFERING'];

var OPTIONS_ANALYSER = {
    smoothingTime: 0.6,
    fftSize: 512
};

var OPTIONS_DEFAULT = {
    autoplay: false,
    shadowBlur: 20,
    shadowColor: '#ffffff',
    barColor: '#cafdff',
    barWidth: 2,
    barHeight: 2,
    barSpacing: 7,
    font: ['12px', 'Helvetica']
};

var Visualizer = _react2['default'].createClass({
    displayName: 'Visualizer',

    getInitialState: function getInitialState() {
        return {
            playing: false,
            requestAnimationFrame: null,
            animFrameId: null,
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
            extensions: {},
            model: null
        };
    },

    componentWillMount: function componentWillMount() {
        var _this = this;

        this._setContext().then(function () {
            _this._setAnalyser();
        }).then(function () {
            _this._setFrequencyData();
        }).then(function () {
            _this._setRequestAnimationFrame();
        })['catch'](function (error) {
            _this._onDisplayError(error);
        });
    },

    componentDidMount: function componentDidMount() {
        var _this2 = this;

        this._extend().then(function () {
            _this2._setBufferSourceNode();
        }).then(function () {
            _this2._setCanvasContext();
        }).then(function () {
            _this2._setCanvasStyles();
        }).then(function () {
            _this2._onResetTimer().then(function () {
                _this2._onRender({
                    renderText: _this2.state.extensions.renderText,
                    renderTime: _this2.state.extensions.renderTime
                });
                _this2.state.options.autoplay && _this2._onResolvePlayState();
            });
        })['catch'](function (error) {
            _this2._onDisplayError(error);
        });
    },

    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        var _this3 = this;

        if (this.state.model !== nextProps.model) {
            this._onAudioStop().then(function () {
                _this3.setState({ model: nextProps.model }, function () {
                    _this3.componentDidMount();
                });
            });
        }
    },

    componentWillUnmount: function componentWillUnmount() {
        var ctx = this.state.ctx;

        ctx.close();
    },

    /**
     * @description
     * Display visualizer error.
     *
     * @param {Object} error
     * @return {Function}
     * @private
     */
    _onDisplayError: function _onDisplayError(error) {
        return window.console.error(error);
    },

    /**
     * @description
     * Extend constructor options.
     *
     * @return {Object}
     * @private
     */
    _extend: function _extend() {
        var _this4 = this;

        var options = _extends(OPTIONS_DEFAULT, this.props.options);
        var extensions = _extends({}, this.props.extensions || {
            renderStyle: this._onRenderStyleDefault,
            renderText: this._onRenderTextDefault,
            renderTime: this._onRenderTimeDefault
        });

        return new Promise(function (resolve, reject) {
            _this4.setState({
                options: options,
                model: _this4.props.model,
                extensions: extensions
            }, function () {
                return resolve();
            });
        });
    },

    /**
     * @description
     * Set canvas context.
     *
     * @return {Object}
     * @private
     */
    _setCanvasContext: function _setCanvasContext() {
        var _this5 = this;

        var canvasCtx = this.refs.canvas.getContext('2d');

        return new Promise(function (resolve, reject) {
            _this5.setState({ canvasCtx: canvasCtx }, function () {
                return resolve();
            });
        });
    },

    /**
     * @description
     * Set audio context.
     *
     * @return {Object}
     * @private
     */
    _setContext: function _setContext() {
        var _this6 = this;

        var error = { message: 'Web Audio API is not supported.' };

        return new Promise(function (resolve, reject) {
            try {
                window.AudioContext = window.AudioContext || window.webkitAudioContext;
                _this6.setState({ ctx: new window.AudioContext() }, function () {
                    return resolve();
                });
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
    _setAnalyser: function _setAnalyser() {
        var _this7 = this;

        var ctx = this.state.ctx;

        return new Promise(function (resolve, reject) {
            var analyser = ctx.createAnalyser();

            analyser.smoothingTimeConstant = OPTIONS_ANALYSER.smoothingTime;
            analyser.fftSize = OPTIONS_ANALYSER.fftSize;

            _this7.setState({ analyser: analyser }, function () {
                return resolve();
            });
        });
    },

    /**
     * @description
     * Set frequency data.
     *
     * @return {Object}
     * @private
     */
    _setFrequencyData: function _setFrequencyData() {
        var _this8 = this;

        var analyser = this.state.analyser;

        return new Promise(function (resolve, reject) {
            var frequencyData = new Uint8Array(analyser.frequencyBinCount);

            _this8.setState({ frequencyData: frequencyData }, function () {
                return resolve();
            });
        });
    },

    /**
     * @description
     * Set source buffer and connect processor and analyser.
     *
     * @return {Object}
     * @private
     */
    _setBufferSourceNode: function _setBufferSourceNode() {
        var _this9 = this;

        var _state = this.state;
        var ctx = _state.ctx;
        var analyser = _state.analyser;

        return new Promise(function (resolve, reject) {
            var sourceNode = ctx.createBufferSource();

            sourceNode.connect(analyser);
            sourceNode.connect(ctx.destination);
            sourceNode.onended = function () {
                _this9._onAudioStop();
            };

            _this9.setState({ sourceNode: sourceNode }, function () {
                return resolve();
            });
        });
    },

    /**
     * @description
     * Set request animation frame fn.
     *
     * @return {Object}
     * @private
     */
    _setRequestAnimationFrame: function _setRequestAnimationFrame() {
        var _this10 = this;

        return new Promise(function (resolve, reject) {
            var requestAnimationFrame = (function () {
                return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
                    window.setTimeout(callback, 1000 / 60);
                };
            })();

            _this10.setState({ requestAnimationFrame: requestAnimationFrame }, function () {
                return resolve();
            });
        });
    },

    /**
     * @description
     * Set canvas gradient color.
     *
     * @return {Object}
     * @private
     */
    _setCanvasStyles: function _setCanvasStyles() {
        var _this11 = this;

        var canvasCtx = this.state.canvasCtx;
        var _state$options = this.state.options;
        var barColor = _state$options.barColor;
        var shadowBlur = _state$options.shadowBlur;
        var shadowColor = _state$options.shadowColor;
        var font = _state$options.font;

        var gradient = canvasCtx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(1, barColor);

        var ctx = _extends(canvasCtx, {
            fillStyle: gradient,
            shadowBlur: shadowBlur,
            shadowColor: shadowColor,
            font: font.join(' '),
            textAlign: 'center'
        });

        return new Promise(function (resolve, reject) {
            _this11.setState({
                gradient: gradient,
                canvasCtx: ctx
            }, function () {
                return resolve();
            });
        });
    },

    /**
     * @description
     * On playstate change.
     *
     * @param {String} state
     * @return {Function<Object>}
     * @private
     */
    _onChange: function _onChange(state) {
        var onChange = this.props.onChange;

        return onChange && onChange.call(this, { status: state });
    },

    /**
     * @description
     * Resolve play state.
     *
     * @return {Function}
     * @private
     */
    _onResolvePlayState: function _onResolvePlayState() {
        var ctx = this.state.ctx;

        if (!this.state.playing) {
            return ctx.state === 'suspended' ? this._onAudioPlay() : this._onAudioLoad();
        } else {
            return this._onAudioPause();
        }
    },

    /**
     * @description
     * Load audio file fn.
     *
     * @return {Object}
     * @private
     */
    _onAudioLoad: function _onAudioLoad() {
        var _this12 = this;

        var _state2 = this.state;
        var ctx = _state2.ctx;
        var canvasCtx = _state2.canvasCtx;
        var model = _state2.model;
        var canvas = this.refs.canvas;

        canvasCtx.fillText('Loading...', canvas.width / 2 + 10, canvas.height / 2 - 25);
        this._onChange(STATES[3]);

        this._httpGet().then(function (response) {
            ctx.decodeAudioData(response, function (buffer) {
                model === _this12.state.model && _this12._onAudioPlay(buffer);
            }, function (error) {
                _this12._onDisplayError(error);
            });
        });

        return this;
    },

    /**
     * @description
     * Http GET method.
     *
     * @return {Object}
     * @private
     */
    _httpGet: function _httpGet() {
        var model = this.state.model;

        return new Promise(function (resolve, reject) {
            var req = new XMLHttpRequest();
            req.open('GET', model.path, true);
            req.responseType = 'arraybuffer';

            req.onload = function () {
                return resolve(req.response);
            };

            req.send();
        });
    },

    /**
     * @description
     * Audio pause fn.
     *
     * @return {Object}
     * @private
     */
    _onAudioPause: function _onAudioPause() {
        var _this13 = this;

        var ctx = this.state.ctx;

        this.setState({ playing: false }, function () {
            ctx.suspend().then(function () {
                _this13._onChange(STATES[2]);
            });
        });

        return this;
    },

    /**
     * @description
     * Audio stop fn.
     *
     * @return {Object}
     * @private
     */
    _onAudioStop: function _onAudioStop() {
        var _this14 = this;

        var _state3 = this.state;
        var canvasCtx = _state3.canvasCtx;
        var ctx = _state3.ctx;
        var canvas = this.refs.canvas;

        return new Promise(function (resolve, reject) {
            window.cancelAnimationFrame(_this14.state.animFrameId);
            clearInterval(_this14.state.interval);
            _this14.state.sourceNode.disconnect();
            canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
            _this14._onChange(STATES[0]);

            _this14._onResetTimer().then(function () {
                ctx.resume();
            }).then(function () {
                _this14._setBufferSourceNode();
            }).then(function () {
                _this14.setState({
                    playing: false,
                    animFrameId: null
                }, function () {
                    return resolve();
                });
            });
        });
    },

    /**
     * @description
     * Audio play fn.
     *
     * @return {Object}
     * @private
     */
    _onAudioPlay: function _onAudioPlay(buffer) {
        var _this15 = this;

        var _state4 = this.state;
        var ctx = _state4.ctx;
        var sourceNode = _state4.sourceNode;

        this.setState({ playing: true }, function () {
            _this15._onChange(STATES[1]);

            if (ctx.state === 'suspended') {
                ctx.resume();
                return _this15._onRenderFrame();
            }

            sourceNode.buffer = buffer;
            sourceNode.start(0);
            _this15._onResetTimer().then(function () {
                _this15._onStartTimer()._onRenderFrame();
            });
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
    _onResetTimer: function _onResetTimer() {
        var _this16 = this;

        return new Promise(function (resolve, reject) {
            _this16.setState({
                duration: new Date(0, 0).getTime(),
                minutes: '00',
                seconds: '00'
            }, function () {
                return resolve();
            });
        });
    },

    /**
     * @description
     * Start audio timer fn.
     *
     * @return {Object}
     * @private
     */
    _onStartTimer: function _onStartTimer() {
        var _this17 = this;

        var interval = setInterval(function () {
            if (_this17.state.playing) {
                var now = new Date(_this17.state.duration);
                var min = now.getHours();
                var sec = now.getMinutes() + 1;

                _this17.setState({
                    minutes: min < 10 ? '0' + min : min,
                    seconds: sec < 10 ? '0' + sec : sec,
                    duration: now.setMinutes(sec)
                });
            }
        }, 1000);

        this.setState({ interval: interval });
        return this;
    },

    /**
     * @description
     * Render canvas frame.
     *
     * @return {Object}
     * @private
     */
    _onRenderFrame: function _onRenderFrame() {
        var _this18 = this;

        var _state5 = this.state;
        var analyser = _state5.analyser;
        var frequencyData = _state5.frequencyData;
        var requestAnimationFrame = _state5.requestAnimationFrame;
        var animFrameId = _state5.animFrameId;

        if (this.state.playing) {
            var _animFrameId = requestAnimationFrame(this._onRenderFrame);

            this.setState({ animFrameId: _animFrameId }, function () {
                analyser.getByteFrequencyData(frequencyData);
                _this18._onRender(_this18.state.extensions);
            });
        }

        return this;
    },

    /**
     * @description
     * On render frame fn.
     * Invoke each of the render extensions.
     *
     * @param {Object} extensions
     * @return {Function}
     * @private
     */
    _onRender: function _onRender(extensions) {
        var _this19 = this;

        var canvasCtx = this.state.canvasCtx;
        var canvas = this.refs.canvas;

        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
        Object.keys(extensions).forEach(function (extension) {
            return extensions[extension] && extensions[extension].call(_this19, _this19);
        });
    },

    /**
     * @description
     * Render audio time fn.
     * Default time rendering fn.
     *
     * @return {Object}
     * @private
     */
    _onRenderTimeDefault: function _onRenderTimeDefault() {
        var canvasCtx = this.state.canvasCtx;
        var canvas = this.refs.canvas;

        var time = this.state.minutes + ':' + this.state.seconds;
        canvasCtx.fillText(time, canvas.width / 2 + 10, canvas.height / 2 + 40);
        return this;
    },

    /**
     * @description
     * Render audio author and title fn.
     * Default text rendering fn.
     *
     * @return {Object}
     * @private
     */
    _onRenderTextDefault: function _onRenderTextDefault() {
        var canvasCtx = this.state.canvasCtx;
        var canvas = this.refs.canvas;
        var model = this.state.model;
        var font = this.state.options.font;

        var cx = canvas.width / 2;
        var cy = canvas.height / 2;
        var fontAdjustment = 6;
        var alignAdjustment = 8;

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
     * Render lounge style type.
     * Default rendering style.
     *
     * @return {Object}
     * @private
     */
    _onRenderStyleDefault: function _onRenderStyleDefault() {
        var _state6 = this.state;
        var frequencyData = _state6.frequencyData;
        var canvasCtx = _state6.canvasCtx;
        var canvas = this.refs.canvas;
        var _state$options2 = this.state.options;
        var barWidth = _state$options2.barWidth;
        var barHeight = _state$options2.barHeight;
        var barSpacing = _state$options2.barSpacing;

        var radiusReduction = 70;
        var amplitudeReduction = 6;

        var cx = canvas.width / 2;
        var cy = canvas.height / 2;
        var radius = Math.min(cx, cy) - radiusReduction;
        var maxBarNum = Math.floor(radius * 2 * Math.PI / (barWidth + barSpacing));
        var slicedPercent = Math.floor(maxBarNum * 25 / 100);
        var barNum = maxBarNum - slicedPercent;
        var freqJump = Math.floor(frequencyData.length / maxBarNum);

        for (var i = 0; i < barNum; i++) {
            var amplitude = frequencyData[i * freqJump];
            var theta = i * 2 * Math.PI / maxBarNum;
            var delta = (3 * 45 - barWidth) * Math.PI / 180;
            var x = 0;
            var y = radius - (amplitude / 12 - barHeight);
            var w = barWidth;
            var h = amplitude / amplitudeReduction + barHeight;

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
    render: function render() {
        var _props = this.props;
        var model = _props.model;
        var width = _props.width;
        var height = _props.height;

        var classes = ['visualizer', this.props.className].join(' ');

        return _react2['default'].createElement(
            'div',
            { className: classes, onClick: this._onResolvePlayState },
            _react2['default'].createElement('audio', {
                className: 'visualizer__audio',
                src: model.path }),
            _react2['default'].createElement(
                'div',
                { className: 'visualizer__canvas-wrapper' },
                _react2['default'].createElement('canvas', {
                    ref: 'canvas',
                    className: 'visualizer__canvas',
                    width: width,
                    height: height })
            )
        );
    }
});

Visualizer.PropTypes = {
    model: _react.PropTypes.object.isRequired,
    options: _react.PropTypes.object,
    className: _react.PropTypes.string,
    extensions: _react.PropTypes.object,
    onChange: _react.PropTypes.func,
    width: _react.PropTypes.string,
    height: _react.PropTypes.string
};

exports['default'] = Visualizer;
module.exports = exports['default'];

},{"react":undefined}]},{},[]);
