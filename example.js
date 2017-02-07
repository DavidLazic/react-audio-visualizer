require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var Visualizer = require('react-audio-visualizer');

var DATA = [{
    model: {
        path: './audio_one.mp3',
        author: 'Galimatias & Joppe',
        title: 'Mintaka'
    },
    options: { autoplay: false }
}, {
    model: {
        path: './audio_two.mp3',
        author: 'NCT',
        title: 'Rain Beyond The Sun'
    },
    options: { autoplay: true },
    className: 'visualizer--custom-modifier'
}];

var App = React.createClass({
    displayName: 'App',

    getInitialState: function getInitialState() {
        return { item: DATA[0] };
    },

    onSelect: function onSelect(item) {
        this.setState({ item: item });
    },

    onRenderStyle: function onRenderStyle(context) {
        // Render style decorator
        // Write custom rendering style here
    },

    onRenderText: function onRenderText(context) {
        // Render text decorator
        // Write custom rendering text here
    },

    onRenderTime: function onRenderTime(context) {
        // Render time decorator
        // Write custom rendering time here
    },

    onPlayStateChange: function onPlayStateChange(state) {

        // Play state change notifier
        switch (state.status) {

            case 'BUFFERING':
                break;

            case 'PLAYING':
                break;

            case 'PAUSED':
                break;

            case 'ENDED':
                break;
        }
    },

    getLinks: function getLinks() {
        var _this = this;

        return DATA.map(function (item, index) {
            return React.createElement(
                'li',
                { key: index, onClick: function () {
                        _this.onSelect(item);
                    } },
                React.createElement(
                    'div',
                    null,
                    item.model.author,
                    ' - ',
                    item.model.title
                )
            );
        });
    },

    getExtensions: function getExtensions() {
        return {
            renderStyle: this.onRenderStyle,
            renderText: this.onRenderText,
            renderTime: this.onRenderTime
        };
    },

    render: function render() {
        var links = this.getLinks();
        var extensions = this.getExtensions();
        var item = this.state.item;

        return React.createElement(
            'div',
            { className: 'main' },
            React.createElement(Visualizer, {
                className: item.className,
                model: item.model,
                options: item.options,
                onChange: this.onPlayStateChange,
                width: '800px',
                height: '400px' }),
            React.createElement(
                'ul',
                null,
                links
            )
        );
    }
});

ReactDOM.render(React.createElement(App, null), document.getElementById('app'));

},{"react":undefined,"react-audio-visualizer":undefined,"react-dom":undefined}]},{},[1]);
