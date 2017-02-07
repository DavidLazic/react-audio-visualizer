# Visualizer

React component for audio visualization using Web Audio API.


## Demo & Examples

Live demo: [DavidLazic.github.io/react-audio-visualizer](http://DavidLazic.github.io/react-audio-visualizer/)

To build the examples locally, run:

```
npm install
npm start
```

Then open [`localhost:8000`](http://localhost:8000) in a browser.


## Installation

The easiest way to use react-audio-visualizer is to install it from NPM and include it in your own React build process (using [Browserify](http://browserify.org), [Webpack](http://webpack.github.io/), etc).

You can also use the standalone build by including `dist/react-audio-visualizer.js` in your page. If you use this, make sure you have already included React, and it is available as a global variable.

```
npm install react-audio-visualizer --save
```


## Usage

Require Visualizer component.

```javascript
const Visualizer = require('react-audio-visualizer');

<Visualizer>Example</Visualizer>
```

### Properties

Base Visualizer properties.

| Name        | Type      | Required | Description
| ----------- |:---------:|:--------:| -------------
| _model_       | Object    | Yes      | Model is the only required property. It must have `path`, `author` & `title` properties.
| _options_     | Object    | No       | Set custom styling for default rendering functions, properties below.
| _extensions_  | Object    | No       | Decorator functions for overriding default rendering functions, properties below.
| _className_   | String    | No       | Modifier CSS class that will be set on visualizer's container element.
| _width_       | String    | No       | Inline canvas width.
| _height_      | String    | No       | Inline canvas height.
| _onChange_    | Function  | No       | Callback function when play state changes.



*Model* properties

| Name        | Type      | Required | Description
| ----------- |:---------:|:--------:| -------------
| _path_      | String    | Yes      | Path to audio file to be requested as an array buffer via AJAX.
| _author_    | String    | Yes      | Audio author to be rendered on canvas.
| _title_     | String    | Yes      | Audio title to be rendered on canvas.



*Options* properties

| Name          | Type          | Default               | Required | Description
| ------------- |:-------------:|:---------------------:|:--------:| -------------
| _autoplay_    | Boolean       | False                 | No       | Flag if the file should be played automatically.
| _shadowBlur_  | Integer       | 20                    | No       | Canvas shadow blur.
| _shadowColor_ | String        | #ffffff               | No       | Canvas shadow color.
| _barColor_    | String        | #cafdff               | No       | Canvas bar color.
| _barWidth_    | Integer       | 2                     | No       | Canvas bar width.
| _barHeight_   | Integer       | 2                     | No       | Canvas bar height.
| _barSpacing_  | Integer       | 7                     | No       | Canvas bar spacing.
| _font_        | Array<String> | ['12px', 'Helvetica'] | No       | Canvas font family and size.



*Extensions* properties

| Name          | Type     | Required | Description
| ------------- |:--------:|:--------:| -------------
| _renderStyle_ | Function | No       | Decorator fn for canvas style rendering.
| _renderText_  | Function | No       | Decorator fn for canvas text rendering.
| _renderTime_  | Function | No       | Decorator fn for canvas time rendering.


### Notes

*Possible play states*

* _ENDED_
* _PLAYING_
* _PAUSED_
* _BUFFERING_


## Development (`src`, `lib` and the build process)

**NOTE:** The source code for the component is in `src`. A transpiled CommonJS version (generated with Babel) is available in `lib` for use with node.js, browserify and webpack. A UMD bundle is also built to `dist`, which can be included without the need for any build system.

To build, watch and serve the examples (which will also watch the component source), run `npm start`. If you just want to watch changes to `src` and rebuild `lib`, run `npm run watch` (this is useful if you are working with `npm link`).

## License

MIT License

Copyright (c) 2017 David Lazic

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
