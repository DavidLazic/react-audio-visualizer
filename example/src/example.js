var React = require('react');
var ReactDOM = require('react-dom');
var Visualizer = require('react-audio-visualizer');

const DATA = [
    {
        model: {
            path: './audio_one.mp3',
            author: 'Galimatias & Joppe',
            title: 'Mintaka'
        },
        options: {
            autoplay: false,
            style: 'lounge'
        }
    },
    {
        model: {
            path: './audio_two.mp3',
            author: 'NCT',
            title: 'Rain Beyond The Sun'
        },
        options: {
            autoplay: false,
            style: 'lounge'
        }
    }
];

var App = React.createClass({
	render () {
		return (
			<div>
                <Visualizer
                    model={ DATA[0].model }
                    options={ DATA[0].options }
                    width="800px"
                    height="400px" />
			</div>
		);
	}
});

ReactDOM.render(<App />, document.getElementById('app'));
