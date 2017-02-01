const React = require('react');
const ReactDOM = require('react-dom');
const Visualizer = require('react-audio-visualizer');

const DATA = [
    {
        model: {
            path: './audio_one.mp3',
            author: 'Galimatias & Joppe',
            title: 'Mintaka'
        },
        options: { autoplay: false },
        className: 'visualizer--grayscale'
    },
    {
        model: {
            path: './audio_two.mp3',
            author: 'NCT',
            title: 'Rain Beyond The Sun'
        },
        options: { autoplay: false },
    }
];

const App = React.createClass({

    getInitialState () {
        return { item: null };
    },

    onSelect (item) {
        this.setState({ item });
    },

    onRenderTest (context) {
        // Render decorator
        // Write custom rendering style here if needed
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
                    <div>{ item.model.author }</div>
                    <div>{ item.model.title }</div>
                </li>
            );
        });
    },

	render () {
        const links = this.getLinks();
        const { item } = this.state;

        if (item) {
            return (
    			<div className="main">
                    <Visualizer
                        className={ item.className }
                        model={ item.model }
                        options={ item.options }
                        onRender={ item.onRender }
                        onChange={ this.onPlayStateChange }
                        width="800px"
                        height="400px" />

                    <ul>{ links }</ul>
    			</div>
    		);
        } else {
            return (
    			<div className="main">
                    <ul>{ links }</ul>
    			</div>
    		);
        }
	}
});

ReactDOM.render(<App />, document.getElementById('app'));
