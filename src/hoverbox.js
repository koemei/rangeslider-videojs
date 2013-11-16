(function (){
	function HoverBox_(options){
		var player = this;

		player.hoverbox = new HoverBox(player, options);

		//When the DOM and the video media is loaded
		function initialVideoFinished(event) {
			var plugin = player.hoverbox;
			//All components will be initialize after they have been loaded by videojs
			for (var index in plugin.components) {
				// plugin.components[index].init_();  // this was causing failures so I commented it out.
			}

			// plugin._reset();
			player.trigger('loadedHoverBox'); //Let know if the DOM is ready
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

		options = options || {}; // plugin options - of which we have none

		this.options = options;

		this.init();
	}

	//-- Methods
	HoverBox.prototype = {
		/*Constructor*/
		init:function(){
			var player = this.player || {};

			var hoverBox = this.components.HoverBox = player.hoverbox; // what exactly is happening here?  Is it necessary?
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
		}
	});

		// -- Helper variables and function for mouseover box countdown
	videojs.HoverBox.prototype.timer = 3;

	videojs.HoverBox.prototype.set = false;

	videojs.HoverBox.prototype.interval = undefined;

	videojs.HoverBox.prototype.timeout = undefined;

	videojs.HoverBox.prototype.countDown = function (el) {
		console.log('101 el', el);  // TODO: remove this
		if (this.timer > 0) {
			$(el).addClass('counting');
			$(el).text("clipping in " + this.timer-- + " seconds");
		}
		else if (this.timer === 0) {
			$(el).text('starting clip');
			this.timer--;
		} else {
			$(el).removeClass('counting');
			$(el).addClass('active');
			$(el).text('click to end clip');
			clearInterval(this.interval);
			this.timer = 3;
		}
	};

	videojs.HoverBox.prototype.init_ = function(){
	    	this.hb = this.player_.hoverbox; // this used to say rangeslider but somehow it worked...
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
			this.interval = setInterval(function() {
				this.countDown.call(this, this.element);
			}.bind(this), 1000);
			console.log('interval 135', this.interval);  // TODO: remove this
			console.log('time now', this.player_.currentTime());  // TODO: remove this
			this.timeout = setTimeout(function() {
				if (!this.set) {
					this.set = true;
					console.log('set is now true');  // TODO: remove this
					// logic to start clips two seconds before hover
					if (this.player_.currentTime() < 5) {
						this.startTime = 0;
					} else {
						this.startTime = this.player_.currentTime() - 5;
					}
				}
			}.bind(this), 3000);
		}.bind(this);

		this.element.onmouseout = function(event) {
			console.log('mouseout');  // TODO: remove this
			$(this).removeClass('counting');
			this.set = false;
			this.timer = 3;
			this.element.innerHTML = 'hover over me';
			clearInterval(this.interval);
			if (!this.set) {
				clearTimeout(this.timeout);
			}
		}.bind(this);

		this.element.onclick = function(event) {  // TODO: eventually we'll need to make a post request to the Koemei API in this method
			event.preventDefault();
			if ( $(event.srcElement).hasClass('active') ) {
				this.endTime = this.player_.currentTime();
				this.set = false;
				$(this.element).removeClass('active');
				setTimeout(function () {
					this.element.innerHTML = 'hover over me';
					console.log('querystring:', $(location).attr('href') + '?start=' + this.startTime + '&end=' + this.endTime);
				}.bind(this), 300);
			}
		}.bind(this);
		return this.element;
	};

})();
