HoverBox-videojs
==================
##The HoverBox Plugin for Video JS Player

This is a plugin for Video JS player. The aim of this plugin is to use a minimal in-video interaction to create a clip of a video segment without interrupting the viewing experience.

This plugin is modified from @danielcebrian's work on on the RangeSlider here: 

https://github.com/danielcebrian/rangeslider-videojs

##Live-Demo

There is a demo here:

https://test.koemei.com/demo/rangeslider/

##Installation

Add youtube-plugin, rangeslider, and hovervox files to your head tag, just after videojs:

```html
<html>
	<head>
		<!--Latest VideoJS-->
		<link href="http://vjs.zencdn.net/4.1/video-js.css" rel="stylesheet">
		<script src="lib/video.min.js"></script>
		
		<!--YouTube Plugin-->
		<script src="lib/media.youtube.js"></script>

		<!--RangeSlider Plugin-->
		<script src="src/rangeslider.js"></script>
		<link href="build/rangeslider.min.css" rel="stylesheet">

		<!--HoverBox Plugin -->
		<script src="src/hoverbox.js"></script>
		<link href="src/hoverbox.css" rel="stylesheet">

	        <!--Demo CSS-->
		<link href="demo.css" rel="stylesheet">

	</head>
	<body>
		...
```

##Usage

Load a video in video-js, as you can see in the YouTube Plugin Docs [YouTube video-js player](https://github.com/eXon/videojs-youtube/) 

```html
 <video id="vid1" class="video-js vjs-default-skin" controls preload="auto" width="640" height="360">
        </video>
  <script>
          videojs('vid1', { "techOrder": ["youtube"], "src": "//youtube.com/watch?v=bTUrWYv2vtU" }).ready(function() {
            // Detect when the YouTube API is ready
            console.log('YouTube API ready');
            // Cue a video using ended event
            this.one('ended', function() {
              this.src('http://youtube.com/watch?v=bTUrWYv2vtU');
                  });
          });
```
	
In addition, to load and control the plugin from Javascript must add a few lines of javascript like:

```js
                var options ={};
                mplayer = videojs("vid1");
                mplayer.rangeslider(options);
                mplayer.hoverbox();
                mplayer.addChild('HoverBox');
```

You can specify to the plugin to be loaded with the range slider open, the panel time, etc.. with the initial options. For example:

locked = true/false;
hidden = true/false;
panel = true/false;
controlTime = true/false;

```js
var options = {locked:true,controlTime:false}, //This will lock the range slider and won't show the control time panel to set the position of the arrows
	mplayer=videojs("vid1"),
	mplayer.rangeslider(options); 
```
	
#API Methods

Once the plugin is started, we can control the range slider with the following functions:

### showSlider() ###

Show the Slider Bar Component

```js
	mplayer.showSlider();
```

### hideSlider() ###

Hide the Slider Bar Component

```js
	mplayer.hideSlider();
```

### showSliderPanel() ###

Show the Panel above the arrow with the current position

```js
	mplayer.showSliderPanel();
```

### hideSliderPanel() ###

Hide the Panel above the arrow with the current position

```js
	mplayer.hideSliderPanel();
```

### showControlTime() ###

Show the panel to edit the time for the start and end arrows

```js
	mplayer.showControlTime();
```

### hideControlTime() ###

Hide the panel to edit the time for the start and end arrows

```js
	mplayer.hideControlTime();
```

### lockSlider() ###

Lock the Slider bar and it will not be possible to change the arrow positions

```js
	mplayer.lockSlider();
```

### unlockSlider() ###

Unlock the Slider bar and it will be possible to change the arrow positions

```js
	mplayer.unlockSlider();
```

### setValueSlider() ###

Set a values in seconds for the position of the arrows.

```js
	mplayer.setValueSlider(start,end);
```

### playBetween() ###

The video will be played in a selected section. It is necessary to enter the start and end second.

```js
	mplayer.playBetween(start, end);
```

### loopBetween() ###

The video will be looped in a selected section. It is necessary to enter the start and end second.

```js
	mplayer.loopBetween(start, end);
```

### getValueSlider() ###

Get the Values of the arrows in second.

```js
	mplayer.getValueSlider();
```


## EVENTS


### loadedRangeSlider `EVENT`

> Fired when the plugin has been loaded

```js
	mplayer.on("loadedRangeSlider",function() {
		//init
		...
	});
```

### sliderchange `EVENT`
> Fired when the values of slider have changed

```js
	mplayer.on("sliderchange",function() {
		var values = mplayer.getValueSlider();
		...
	});
```
