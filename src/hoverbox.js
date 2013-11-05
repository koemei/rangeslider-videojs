(function (){
function HoverBox_(options){
var player = this;
	
	player.hoverbox=new HoverBox(player, options);
	
	//When the DOM and the video media is loaded
	function initialVideoFinished(event) {
		var plugin = player.hoverbox;
		//All components will be initialize after they have been loaded by videojs
		for (var index in plugin.components) {
			plugin.components[index].init_();
		}
		
		plugin._reset();
		player.trigger('loadedHoverBox'); //Let know if the Range Slider DOM is ready
	}
	if (player.techName == 'Youtube'){
		//Detect youtube problems
		player.one('error', function(e){
			switch (player.error) {
				case 2:
					alert("The request contains an invalid parameter value. For example, this error occurs if you specify a video ID that does not have 11 characters, or if the video ID contains invalid characters, such as exclamation points or asterisks.");
				case 5:
					alert("The requested content cannot be played in an HTML5 player or another error related to the HTML5 player has occurred.");
				case 100:
					alert("The video requested was not found. This error occurs when a video has been removed (for any reason) or has been marked as private.");
					break;
				case 101:
					alert("The owner of the requested video does not allow it to be played in embedded players.");
					break;
				case 150:
					alert("The owner of the requested video does not allow it to be played in embedded players.");
					break;
				default:
					alert("Unknown Error");
					break;
			}
		});
		player.on('firstplay', initialVideoFinished);
	}else{
		player.one('playing', initialVideoFinished);
	}
	
	
	console.log("Loaded Plugin HoverBox");
}
videojs.plugin('hoverbox', HoverBox_);



//-- Plugin
function HoverBox(player,options){
	var player = player || this;
	
	this.player = player;
	
	this.components = {}; // holds any custom components we add to the player

	options = options || {}; // plugin options	

	this.options = options;

	this.init();
}

//-- Methods
HoverBox.prototype = {
	/*Constructor*/
	init:function(){
		var player = this.player || {};

		var hoverBox = this.components.HoverBox = player.hoverbox;
	},
};

/**
 * This is the hover box
 * @param {videojs.Player|Object} player
 * @param {Object=} options
 * @constructor
 */
videojs.HoverBox = videojs.Component.extend({
  /** @constructor */
	init: function(player, options){
		videojs.Component.call(this, player, options);
		console.log(this);
	}
});

videojs.HoverBox.prototype.init_ = function(){
    	this.rs = this.player_.rangeslider;
};

videojs.HoverBox.prototype.options_ = {
	children: {
	}
};

videojs.HoverBox.prototype.createEl = function(){
	return videojs.Component.prototype.createEl.call(this, 'button', {
		className: 'vjs-hoverbox-RS',
		innerHTML:  'Hello!!!'
	});
};


})();