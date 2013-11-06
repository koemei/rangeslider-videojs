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

		this.fired = false;

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

	// -- Helper function for hoverstate

	var countDown = function (startTime, el){
		console.log('selector', el);
		if (startTime > 0) {
			console.log(startTime);
			el.innerHTML = "clip starting in " + startTime-- + " seconds";
		}
		else if (startTime === 0) {
			console.log(startTime);
			el.innerHTML = 'starting clip';
		} else {
			el.innerHTML = 'click to end clip';
		}
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
			console.log("this", this);
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
		this.element = videojs.Component.prototype.createEl.call(this, 'button', {
			className: 'vjs-hoverbox',
			innerHTML:  'hover over me'
		});
		this.element.onmouseover = function() {
			this.interval = setInterval(countDown(3, this.element), 1000);
			this.timeout = setTimeout(function() {
				if (!this.fired) {
					this.fired = true;
					// logic to start clips three seconds before hover begins 
					if (this.player_.currentTime() < 5) { 
						this.startTime = 0;
					} else {
						this.startTime = this.player_.currentTime() - 5;
					}
				}
			}.bind(this), 3000);
		}.bind(this);
		this.element.onmouseout = function(event) {
			if (!this.fired) {
				clearTimeout(this.timeout);
			}	else {
				clearInterval(this.interval);
				this.element.innerHTML = 'hover over me';
			}
		}.bind(this);
		this.element.onclick = function(event) {
			event.preventDefault();
			this.endTime = this.player_.currentTime();
			this.fired = false;
			setTimeout(function () { 
				this.element.innerHTML = 'hover over me';
				console.log('querystring:', $(location).attr('href') + '?start=' + this.startTime + '&end=' + this.endTime);
			}.bind(this), 300);
		}.bind(this);
		return this.element;
	};

})();
