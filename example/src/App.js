import React from 'react'

import Visualizer from 'react-audio-visualizer'
import 'react-audio-visualizer/dist/index.css'

import audioOne from './audio_one.mp3'
import audioTwo from './audio_two.mp3'

var createReactClass = require('create-react-class')

const DATA = [
  {
    model: {
      path: audioOne,
      author: 'Galimatias & Joppe',
      title: 'Mintaka'
    },
    options: { autoplay: false }
  },
  {
    model: {
      path: audioTwo,
      author: 'NCT',
      title: 'Rain Beyond The Sun'
    },
    options: { autoplay: true },
    className: 'visualizer--custom-modifier'
  }
];

const App = createReactClass({

  getInitialState () {
    return { item: DATA[0] };
  },

  onSelect (item) {
    this.setState({ item });
  },

  onRenderStyle (context) {
    // Render style decorator
    // Write custom rendering style here
  },

  onRenderText (context) {
    // Render text decorator
    // Write custom rendering text here
  },

  onRenderTime (context) {
    // Render time decorator
    // Write custom rendering time here
  },

  onPlayStateChange (state) {

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

  getLinks () {
    return DATA.map((item, index) => {
      return (
        <li key={ index } onClick={ () => { this.onSelect(item); } }>
          <div>{ item.model.author } - { item.model.title }</div>
        </li>
      );
    });
  },

  getExtensions () {
    return {
      renderStyle: this.onRenderStyle,
      renderText: this.onRenderText,
      renderTime: this.onRenderTime
    };
  },

  render () {
    const links = this.getLinks();
    const extensions = this.getExtensions();
    const { item } = this.state;

    return (
      <div className="main">
        <Visualizer
          className={ item.className }
          model={ item.model }
          options={ item.options }
          onChange={ this.onPlayStateChange }
          width="800px"
          height="400px" />

        <ul>{ links }</ul>
      </div>
    );
  }
});

export default App
